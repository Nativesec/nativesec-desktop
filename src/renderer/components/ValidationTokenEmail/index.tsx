/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { validationTokenEmail } from 'renderer/utils/validations/Yup';

import Logo from '../../../../assets/logoNativesec/brand-nativesec.svg';

import styles from './styles.module.sass';
import { IValidationTokenEmail, IValidationTokenEmailProps } from './types';

const ValidationTokenEmail = ({
  type,
  savePrivateKey = false,
  handleSetIsLoading,
}: IValidationTokenEmailProps) => {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values: IValidationTokenEmail) => {
    setButtonIsLoading(true);
    handleSetIsLoading(false);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.AUTH_LOGIN,
      data: {
        token: values.token,
      },
    });
    toast.dismiss('send-token');
  };

  const handleResendToken = () => {
    const { myEmail } = window.electron.store.get('user');
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.AUTH_PASSWORD,
      data: {
        email: myEmail,
        type: 'login',
      },
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.AUTH_LOGIN_RESPONSE, (arg: any) => {
      switch (arg.status) {
        case 200:
          if (type === 'register') {
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.GENERATE_PAR_KEYS,
              data: {
                savePrivateKey,
              },
            });
          } else {
            setButtonIsLoading(false);
            navigate('/home');
          }
          break;
        case 401:
          setButtonIsLoading(false);
          toast.warning(
            'Verifique se o token está correto e tente novamente.',
            { ...toastOptions, toastId: 'verify-token' }
          );
          break;
        default:
          setButtonIsLoading(false);
          toast.error('Erro, tente novamente.', {
            ...toastOptions,
            toastId: 'error',
          });
          break;
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.GENERATE_PAR_KEYS_RESPONSE, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.GET_PUBLIC_KEY,
      });
      handleSetIsLoading(true);
      navigate('/home');
    });
  }, []);

  return (
    <div className={styles.validationTokenEmail}>
      <img src={Logo} alt="" />
      <div className={styles.validation_form}>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={validationTokenEmail}
          initialValues={{
            token: '',
            safetyPhrase: '',
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <InputAnimated
                name="token"
                text="Token"
                type="password"
                value={values.token}
                onBlur={handleBlur}
                onChange={handleChange}
                isValid={!(Boolean(errors.token) && touched.token)}
              />
              {errors.token && touched.token && (
                <p className={styles.form_error}>{errors.token}</p>
              )}
              <ButtonLoading
                isLoading={buttonIsLoading}
                type="submit"
                text="Entrar"
                className={styles.buttonBlue}
              />
            </Form>
          )}
        </Formik>
        <ButtonLoading
          onClick={handleResendToken}
          className={styles.buttonPurple}
          text="Reenviar token"
        />
      </div>
    </div>
  );
};

export default ValidationTokenEmail;
