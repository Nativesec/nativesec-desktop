/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import { useEffect, useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { IDefaultApiResult } from 'renderer/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import {
  ChangeSafetyPhraseInitialValues,
  ChangeSafetyPhraseSchema,
} from 'renderer/utils/validations/Yup/ChangeSafetyPhrase';
import { IChangeSafetyPhrase, IChangeSafetyPhraseProps } from '../types';
import styles from './styles.module.sass';

export function ChangeSafetyPhrase({ currentTheme }: IChangeSafetyPhraseProps) {
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const [openChangePhrase, setOpenChangePhrase] = useState<boolean>(false);

  function handleSubmit(values: IChangeSafetyPhrase) {
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    setButtonIsLoading(true);
    if (values.safetyPhrase !== safetyPhrase) {
      toast.error('Frase secreta invalida.', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
      setButtonIsLoading(false);
    } else {
      window.electron.ipcRenderer.sendMessage('changeSafetyPhrase', [
        { newSecret: values.newSafetyPhrase },
      ]);
    }
  }

  const formikProps = useFormik({
    initialValues: ChangeSafetyPhraseInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: ChangeSafetyPhraseSchema,
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('changeSafetyPhrase-response', (result) => {
      const myResult = result as IDefaultApiResult;
      setOpenChangePhrase(false);
      setButtonIsLoading(false);
      switch (myResult.status) {
        case 200:
          toast.success('Frase secreta alterada.', {
            ...toastOptions,
            toastId: 'changeSafetyPhraseSuccess',
          });
          break;

        default:
          toast.error('Erro ao alterar frase secreta.', {
            ...toastOptions,
            toastId: 'changeSafetyPhraseSuccess',
          });
          break;
      }
    });
  }, []);

  return (
    <div
      className={`${styles.securityPhrase} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.header}>
        <h3 onClick={() => setOpenChangePhrase(!openChangePhrase)}>
          <FaKey />
          Trocar Frase Secreta
        </h3>
      </div>
      {openChangePhrase && (
        <div className={styles.changePhrase}>
          <form onSubmit={formikProps.submitForm}>
            <InputAnimated
              text="Frase Secreta"
              name="safetyPhrase"
              type="password"
              value={formikProps.values.safetyPhrase}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              isValid={
                !(
                  Boolean(formikProps.errors.safetyPhrase) &&
                  formikProps.touched.safetyPhrase
                )
              }
            />
            {formikProps.errors.safetyPhrase &&
              formikProps.touched.safetyPhrase && (
                <p className={styles.formError}>
                  {formikProps.errors.safetyPhrase}
                </p>
              )}
            <InputAnimated
              text="Nova Frase Secreta. "
              name="newSafetyPhrase"
              type="password"
              value={formikProps.values.newSafetyPhrase}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              isValid={
                !(
                  Boolean(formikProps.errors.safetyPhrase) &&
                  formikProps.touched.safetyPhrase
                )
              }
            />
            {formikProps.errors.newSafetyPhrase &&
              formikProps.touched.newSafetyPhrase && (
                <p className={styles.formError}>
                  {formikProps.errors.newSafetyPhrase}
                </p>
              )}
            <InputAnimated
              text="Repita a Nova Frase Secreta."
              name="confirmNewSafetyPhrase"
              type="password"
              value={formikProps.values.confirmNewSafetyPhrase}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              isValid={
                !(
                  Boolean(formikProps.errors.safetyPhrase) &&
                  formikProps.touched.safetyPhrase
                )
              }
            />
            {formikProps.errors.confirmNewSafetyPhrase &&
              formikProps.touched.confirmNewSafetyPhrase && (
                <p className={styles.formError}>
                  {formikProps.errors.confirmNewSafetyPhrase}
                </p>
              )}
            <ButtonLoading
              text="Salvar"
              isLoading={buttonIsLoading}
              onClick={formikProps.handleSubmit}
            />
          </form>
        </div>
      )}
    </div>
  );
}
