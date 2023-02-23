/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useFormik } from 'formik';

import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import {
  DeleteInviteSchema,
  DeleteInviteInitialValues,
} from 'renderer/utils/validations/Yup/DeleteInvite';

import { IUser } from 'main/types';
import { ModalContext } from 'renderer/contexts/modal/ModalContext';
import { IDeleteInviteModalProps } from '../types';

import styles from './styles.module.sass';

export function RemoveUserModal({
  isOpen,
  onRequestClose,
  user,
  orgId,
  currentTheme,
}: IDeleteInviteModalProps) {
  ReactModal.setAppElement('#root');
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const { isCloseModal, changeModal } = useContext(ModalContext);

  function handleSubmit(values: any) {
    setButtonIsLoading(true);
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    toast.dismiss('invalidSafetyPhrase');
    toast.dismiss('invalidEmail');
    if (user?.email !== values.email) {
      toast.error('Email Invalido', {
        ...toastOptions,
        toastId: 'invalidEmail',
      });
    } else if (values.safetyPhrase !== safetyPhrase) {
      setButtonIsLoading(false);
      toast.error('Frase de Segurança Invalida', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else {
      setButtonIsLoading(false);
      window.electron.ipcRenderer.sendMessage('removeUser', {
        organizationId: orgId,
        user,
      });
    }
  }

  const formikProps = useFormik({
    initialValues: DeleteInviteInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: DeleteInviteSchema,
  });

  useEffect(() => {
    if (isCloseModal) {
      changeModal(false);
      onRequestClose();
    }
    setButtonIsLoading(false);
    formikProps.resetForm();
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
          Deseja realmente remover <br />
          <span>{user?.email}</span> ?
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
