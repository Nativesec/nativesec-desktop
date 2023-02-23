/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-webpack-loader-syntax */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Formik } from 'formik';

import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { loginSchema } from 'renderer/utils/validations/Yup';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';

import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import ValidationTokenEmail from 'renderer/components/ValidationTokenEmail';
import { IDefaultApiResult } from 'renderer/types';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import Logo from '../../../../assets/logoNativesec/brand-nativesec.svg';
import '!style-loader!css-loader!sass-loader!react-toastify/dist/ReactToastify.css';
import styles from './styles.module.sass';
import { ILoginProps } from './types';

interface ILoginSchema {
  email: string;
}

const Login = ({ handleSetIsLoading }: ILoginProps): JSX.Element => {
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const [tokenSend, setTokenSend] = useState(false);
  const initialValues: ILoginSchema = { email: '' };

  const onSubmit = (values: ILoginSchema) => {
    setButtonIsLoading(true);
    toast.dismiss('user-create-success');
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.AUTH_PASSWORD,
      data: {
        email: values.email,
        type: 'login',
      },
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('createPath', []);
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'authPassword-response',
      (arg: IDefaultApiResult) => {
        setButtonIsLoading(false);
        switch (arg.status) {
          case 200:
            if (arg.data?.status === 'ok') {
              setTokenSend(true);
              toast.info('Um Token de acesso foi enviado para seu email', {
                ...toastOptions,
                toastId: 'send-token',
              });
            } else {
              toast.error('Email Invalido, tente novamente.', {
                ...toastOptions,
                toastId: 'invalid-email',
              });
              setButtonIsLoading(false);
            }
            break;
          default:
            setButtonIsLoading(false);
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
    <div className={styles.login}>
      <img src={Logo} alt="" />
      <div className={styles.login_form}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={loginSchema}
        >
          {({ values, errors, handleChange, handleBlur, touched }) => (
            <Form>
              <>
                <InputAnimated
                  name="email"
                  text="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  isValid={!(Boolean(errors.email) && touched.email)}
                />
                {errors.email && touched.email && (
                  <p className={styles.form_error}>{errors.email}</p>
                )}
                <ButtonLoading
                  text="Gerar Token"
                  type="submit"
                  isLoading={buttonIsLoading}
                />
              </>
            </Form>
          )}
        </Formik>
        <Link to="/register">Ainda não possui uma conta? Cadastre-se</Link>
      </div>
    </div>
  ) : (
    <ValidationTokenEmail
      type="login"
      handleSetIsLoading={handleSetIsLoading}
    />
  );
};

export default Login;
