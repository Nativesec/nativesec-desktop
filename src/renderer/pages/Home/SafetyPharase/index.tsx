/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import LottieControl from 'renderer/components/LottieControl';
import { IDefaultApiResult } from 'renderer/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { safetySchema } from 'renderer/utils/validations/Yup';
import animationData from '../../../../../assets/animationsJson/key.json';
import styles from './styles.module.sass';
import { SafetyPhraseProps } from './types';

interface ISafety {
  safetyPhrase: string;
}

const SafetyPhrase = ({
  handleEnter,
  handleSafetyPhrase,
  handleSetIsLoading,
  handleVerifiedSafetyPhrase,
}: SafetyPhraseProps) => {
  const onSubmit = (values: ISafety) => {
    handleSetIsLoading(true);
    window.electron.store.set('user', {
      ...window.electron.store.get('user'),
      safetyPhrase: values.safetyPhrase,
    });

    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.VERIFY_DATABASE_PASSWORD,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PUBLIC_KEY_RESPONSE,
      (result) => {
        const myResult = result as IDefaultApiResult;
        switch (myResult.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.GET_PRIVATE_KEY,
            });
            break;
          default:
            toast.error('Falha Grave.', { ...toastOptions, toastId: 'error' });
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
      (result: IDefaultApiResult) => {
        toast.dismiss('safety-invalid');
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.GET_PUBLIC_KEY,
            });
            break;
          case 26:
            toast.error('Senha Invalida', {
              ...toastOptions,
              toastId: 'safety-invalid',
            });
            handleSetIsLoading(false);
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PRIVATE_KEY_RESPONSE,
      (result: IDefaultApiResult) => {
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.VALIDATE_PRIVATE_KEY,
            });
            break;
          case 404:
            handleVerifiedSafetyPhrase(false);
            handleSafetyPhrase(true);
            handleSetIsLoading(false);
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VALIDATE_PRIVATE_KEY_RESPONSE,
      (result: IDefaultApiResult) => {
        switch (result.status) {
          case 200:
            handleEnter();
            break;
          case 400:
            handleVerifiedSafetyPhrase(false);
            handleSafetyPhrase(false);
            handleSetIsLoading(false);
            toast.error('Senha Invalida', {
              ...toastOptions,
              toastId: 'invalid-safety-phrase',
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  const initialValues = {
    safetyPhrase: '',
  };

  return (
    <div className={styles.safetyPhrase}>
      <div className={styles.safetyPhrase_content}>
        <div className={styles.safetyPhrase_content_svg}>
          <LottieControl animationData={animationData} play loop />
        </div>
        <p>Insira sua frase de segurança para ter acesso a seus Workspaces.</p>
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={safetySchema}
        >
          {({ values, errors, handleChange, handleBlur, touched }) => (
            <Form>
              <InputAnimated
                name="safetyPhrase"
                type="password"
                text="Frase de Segurança"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.safetyPhrase}
                isValid={
                  !(Boolean(errors.safetyPhrase) && touched.safetyPhrase)
                }
              />
              {errors.safetyPhrase && touched.safetyPhrase && (
                <p className={styles.form_error}>{errors.safetyPhrase}</p>
              )}
              <ButtonLoading text="Liberar Workspaces" type="submit" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SafetyPhrase;
