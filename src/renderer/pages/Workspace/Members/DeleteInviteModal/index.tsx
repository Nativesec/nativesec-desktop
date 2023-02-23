/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useFormik } from 'formik';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import {
  DeleteInviteSchema,
  DeleteInviteInitialValues,
} from 'renderer/utils/validations/Yup/DeleteInvite';

import { IUser } from 'main/types';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { ModalContext } from 'renderer/contexts/modal/ModalContext';
import { IDeleteInviteModalProps } from '../types';
import styles from './styles.module.sass';

export function DeleteInviteModal({
  isOpen,
  onRequestClose,
  user,
  orgId,
  currentTheme,
}: IDeleteInviteModalProps) {
  ReactModal.setAppElement('#root');
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const { isCloseModal, changeModal } = useContext(ModalContext);

  const handleSubmit = (values: any) => {
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    toast.dismiss('invalidSafetyPhrase');
    toast.dismiss('invalidEmail');
    if (user?.email !== values.email) {
      toast.error('Email Invalido', {
        ...toastOptions,
        toastId: 'invalidEmail',
      });
    } else if (values.safetyPhrase !== safetyPhrase) {
      toast.error('Frase de Segurança Invalida', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else {
      setButtonIsLoading(true);
      window.electron.ipcRenderer.sendMessage('deleteInviteParticipant', {
        organizationId: orgId,
        user,
      });
    }
  };

  const formikProps = useFormik({
    initialValues: DeleteInviteInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: DeleteInviteSchema,
  });

  useEffect(() => {
    if (isCloseModal === true) {
      changeModal(false);
      onRequestClose();
    }
    formikProps.resetForm();
    setButtonIsLoading(false);
  }, [isOpen, isCloseModal]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.modal}>
        <h3>
          Deseja Realmente Cancelar o Convite de <br />
          <span>{user?.email}</span>
        </h3>
        <form onSubmit={formikProps.handleSubmit}>
          <InputAnimated
            text="Confirme o email do usuario"
            name="email"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            className={styles.input}
            isValid={
              !(Boolean(formikProps.errors.email) && formikProps.touched.email)
            }
          />
          {formikProps.errors.email && formikProps.touched.email && (
            <p> {formikProps.errors.email} </p>
          )}
          <InputAnimated
            text="Frase de Segurança"
            name="safetyPhrase"
            type="password"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            className={styles.input}
            isValid={
              !(
                Boolean(formikProps.errors.safetyPhrase) &&
                formikProps.touched.safetyPhrase
              )
            }
          />
          {formikProps.errors.safetyPhrase &&
            formikProps.touched.safetyPhrase && (
              <p> {formikProps.errors.safetyPhrase} </p>
            )}
          <ButtonLoading
            type="submit"
            text="confirmar"
            isLoading={buttonIsLoading}
          />
          <ButtonLoading text="Cancelar" onClick={onRequestClose} />
        </form>
      </div>
    </ReactModal>
  );
}
