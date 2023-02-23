/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { toast } from 'react-toastify';

import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import { registerSchema } from 'renderer/utils/validations/Yup';

import Checkbox from 'renderer/components/Checkbox';
import ValidationTokenEmail from 'renderer/components/ValidationTokenEmail';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import Logo from '../../../../assets/logoNativesec/brand-nativesec.svg';
import styles from './styles.module.sass';
import { ICreateUserResponse, IRegisterSchema } from './types';

interface RegisterProps {
  handleSetIsLoading:(isLoading: boolean) => void;
}

export function Register ({handleSetIsLoading} : RegisterProps){
  const [isLoading, setIsLoading] = useState(false);
  const [tokenSend, setTokenSend] = useState(false);
  const [savePrivateKey, setSavePrivateKey] = useState(false);

  const onSubmit = (values: IRegisterSchema) => {
    setIsLoading(true);

    window.electron.ipcRenderer.sendMessage('createUser', [
      {
        myFullName: values.name,
        myEmail: values.email,
        safetyPhrase: values.safetyPhrase,
      },
    ]);
    setSavePrivateKey(values.savePrivateKey);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('createUser-response', (arg: any) => {
      const myResult = arg as ICreateUserResponse;
      switch (myResult.status) {
        case 200:
          if (myResult.data.status === 'ok') {
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.INITIALIZEDB,
              data: {
                type: 'register',
              },
            });
          } else {
            toast.error('Este email já está cadastrado.', {
              ...toastOptions,
              toastId: 'email-already-exists',
            });
            setIsLoading(false);
          }
          break;
        default:
          toast.error('Erro, tente novamente.', {
            ...toastOptions,
            toastId: 'error',
          });
          setIsLoading(false);
          break;
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once(IPCTypes.INITIALIZEDB_RESPONSE_REGISTER, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.AUTH_PASSWORD,
        data: {
          email: window.electron.store.get('user').myEmail,
          type: 'register',
        }
      });
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.AUTH_PASSWORD_RESPONSE_REGISTER,
      (arg: any) => {
        setIsLoading(false);
        switch (arg.status) {
          case 200:
            if(arg.data.status === 'ok'){
              window.electron.ipcRenderer.sendMessage('createPath', []);
              toast.info('Um Token de acesso foi enviado para seu email', {
                ...toastOptions,
                toastId: 'send-token',
              });
              setTokenSend(true);
            }
            break;
          default:
            toast.error('Erro, tente novamente.', {
              ...toastOptions,
              toastId: 'error-token',
            });
            break;
        }
      }
    );
  }, []);

  return !tokenSend ? (
    <div className={styles.register}>
      <img src={Logo} alt="" />
      <div className={styles.register_form}>
        <Formik
          onSubmit={onSubmit}
          validationSchema={registerSchema}
          initialValues={{
            name: '',
            email: '',
            safetyPhrase: '',
            confirmSafetyPhrase: '',
            savePrivateKey: false,
          }}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <>
              <Form>
                <InputAnimated
                  name="name"
                  text="Nome"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={!(Boolean(errors.name) && touched.name)}
                />
                {errors.name && touched.name && (
                  <p className={styles.form_error}>{errors.name}</p>
                )}
                <InputAnimated
                  name="email"
                  text="Email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={
                    !(Boolean(errors.email) && touched.email)
                  }
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className={styles.form_error}>{errors.email}</p>
                )}
                <InputAnimated
                  name="safetyPhrase"
                  type="password"
                  text="Frase de Segurança"
                  value={values.safetyPhrase}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={
                    !(Boolean(errors.safetyPhrase) && touched.safetyPhrase)
                  }
                />
                {errors.safetyPhrase && touched.safetyPhrase && (
                  <p className={styles.form_error}>{errors.safetyPhrase}</p>
                )}
                <InputAnimated
                  name="confirmSafetyPhrase"
                  type="password"
                  text="Repita sua Frase de Segurança"
                  value={values.confirmSafetyPhrase}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={
                    !(
                      Boolean(errors.confirmSafetyPhrase) &&
                      touched.confirmSafetyPhrase
                    )
                  }
                />
                {errors.confirmSafetyPhrase && touched.confirmSafetyPhrase && (
                  <p className={styles.form_error}>
                    {errors.confirmSafetyPhrase}
                  </p>
                )}
                <Checkbox
                  value={values.savePrivateKey}
                  onChange={handleChange}
                  name="savePrivateKey"
                  text="Deseja salvar chaves de segurança nos servidores do NATIVESEC."
                />
                <ButtonLoading
                  isLoading={isLoading}
                  text="Cadastre-se"
                  type="submit"
                />
              </Form>
            </>
          )}
        </Formik>

        <Link to="/">Já possui uma conta? Entre</Link>
      </div>
    </div>
  ) : (
    <ValidationTokenEmail handleSetIsLoading={handleSetIsLoading} type="register" savePrivateKey={savePrivateKey} />
  );
}
