/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */

import { useFormik } from 'formik';
import { IUser } from 'main/types';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { toastOptions } from 'renderer/utils/options/Toastify';
import {
  ConfirmSafetyPhraseInitialValues,
  ConfirmSafetyPhraseSchema,
} from 'renderer/utils/validations/Yup/ConfirmSafetyPhrase';
import {
  IConfirmSafetyPhrase,
  IVerifySafetyPhraseModalProps,
} from '../../types';
import styles from './styles.module.sass';

export function VerifySafetyPhraseModal({
  mode,
  isOpen,
  setEditMode,
  currentTheme,
  onRequestClose,
  safeBoxName,
  handleDeleteSafeBox,
  decrypt,
}: IVerifySafetyPhraseModalProps) {
  const handleSubmit = (values: IConfirmSafetyPhrase) => {
    toast.dismiss('invalidSafetyPhrase');
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    if (values.safetyPhrase !== safetyPhrase) {
      toast.error('Frase Secreta Invalida', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else {
      switch (mode) {
        case 'edit':
          setEditMode(true, 'edit');
          onRequestClose();
          break;
        case 'delete':
          if (values.safeBoxName !== safeBoxName) {
            setErrorSafeBoxName('safeBoxName', 'Nome do cofre invalido');
          } else {
            handleDeleteSafeBox();
            onRequestClose();
          }
          break;
        case 'decrypt':
          setEditMode(true, 'decrypt');
          onRequestClose();
          break;
        case 'decryptOne':
          decrypt();
          onRequestClose();
          break;
        case 'copy':
          decrypt();
          onRequestClose();
          break;
        default:
          break;
      }
    }
  };

  const formikProps = useFormik({
    initialValues: ConfirmSafetyPhraseInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: ConfirmSafetyPhraseSchema,
  });

  const setErrorSafeBoxName = (field: string, value: string) => {
    formikProps.setFieldError(field, value);
  };
  useEffect(() => {
    formikProps.resetForm();
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.verify}>
        {mode === 'delete' ? (
          <h2>
            Tem certeza que deseja excluir <span>{safeBoxName}</span> ?
          </h2>
        ) : mode === 'edit' ? (
          <h2>
            Tem certeza que deseja editar <br /> <span>{safeBoxName}</span> ?
          </h2>
        ) : (
          <h2>Insira sua Frase Secreta.</h2>
        )}
        <form onSubmit={formikProps.submitForm}>
          {mode === 'delete' && (
            <InputAnimated
              text="Confirme o nome da organização"
              value={formikProps.values.safeBoxName}
              name="safeBoxName"
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
          )}
          {formikProps.errors.safeBoxName &&
            formikProps.touched.safeBoxName && (
              <p className={styles.formError}>
                {formikProps.errors.safeBoxName}
              </p>
            )}
          <InputAnimated
            text="Frase Secreta"
            value={formikProps.values.safetyPhrase}
            name="safetyPhrase"
            type="password"
            onChange={formikProps.handleChange}
          />
          {formikProps.errors.safetyPhrase &&
            formikProps.touched.safetyPhrase && (
              <p className={styles.formError}>
                {formikProps.errors.safetyPhrase}
              </p>
            )}
          <div className={styles.buttons}>
            <ButtonLoading
              text="Confirmar"
              type="submit"
              onClick={formikProps.handleSubmit}
            />
            <ButtonLoading text="Cancelar" onClick={onRequestClose} />
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
