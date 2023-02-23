/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useFormik } from 'formik';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import InputAnimated from 'renderer/components/Inputs/InputAnimated';

import { IUser } from 'main/types';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import {
  InviteParticipantInitialValues,
  InviteParticipantSchema,
} from 'renderer/utils/validations/Yup/InviteSchema';
import ToggleSwitch from 'renderer/components/Buttons/ToggleSwitch';
import { IInviteParticipant } from 'renderer/utils/validations/Yup/InviteSchema/types';
import { ModalContext } from 'renderer/contexts/modal/ModalContext';
import styles from './styles.module.sass';
import { IInviteMemberModalProps } from '../types';

export function InviteMemberModal({
  isOpen,
  onRequestClose,
  orgId,
  currentTheme,
}: IInviteMemberModalProps) {
  ReactModal.setAppElement('#root');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>();
  const { isCloseModal, changeModal } = useContext(ModalContext);
  function handleSubmit(values: IInviteParticipant) {
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    if (values.safetyPhrase !== safetyPhrase) {
      toast.error('Senha Invalida.', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else {
      setButtonIsLoading(true);
      window.electron.ipcRenderer.sendMessage('inviteParticipant', {
        organizationId: orgId,
        user: {
          email: values.email,
          isAdmin,
        },
      });
    }
  }

  const formikProps = useFormik({
    initialValues: InviteParticipantInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: InviteParticipantSchema,
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
      closeTimeoutMS={200}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.modal}>
        <h2>Convide um membro para seu workspace.</h2>
        <form onSubmit={formikProps.submitForm}>
          <div className={styles.user}>
            <div className={styles.input}>
              <InputAnimated
                text="Email"
                name="email"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                className={styles.input}
                isValid={
                  !(
                    Boolean(formikProps.errors.email) &&
                    formikProps.touched.email
                  )
                }
              />
              {formikProps.errors.email && formikProps.touched.email && (
                <p> {formikProps.errors.email} </p>
              )}
            </div>
            <div className={styles.toggleSwitch}>
              <ToggleSwitch
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <span className={styles.name}>
                {isAdmin ? 'Administrador' : 'Participante'}
              </span>
            </div>
          </div>

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
            onClick={formikProps.handleSubmit}
            isLoading={buttonIsLoading}
          />
          <ButtonLoading
            text="Cancelar"
            type="button"
            onClick={onRequestClose}
          />
        </form>
      </div>
    </ReactModal>
  );
}
