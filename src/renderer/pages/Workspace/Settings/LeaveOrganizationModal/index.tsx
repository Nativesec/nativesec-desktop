/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */

import { useFormik } from 'formik';
import { IUser } from 'main/types';
import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';

import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import { ModalContext } from 'renderer/contexts/modal/ModalContext';
import { toastOptions } from 'renderer/utils/options/Toastify';

import {
  LeaveOrganizationInitialValues,
  LeaveOrganizationSchema,
} from 'renderer/utils/validations/Yup/LeaveOrganization';

import { ILeaveOrganization, ILeaveWorkspaceModal } from '../../types';

import styles from './styles.module.sass';

export function LeaveOrganizationModal({
  organization,
  isOpen,
  currentTheme,
  onRequestClose,
}: ILeaveWorkspaceModal) {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const { isCloseModal, changeModal } = useContext(ModalContext);

  function handleSubmit(values: ILeaveOrganization) {
    setButtonIsLoading(true);
    toast.dismiss('invalidSafetyPhrase');
    toast.dismiss('errorLeaveWorkspace');
    toast.dismiss('invalidOrganizationName');

    const { safetyPhrase } = window.electron.store.get('user') as IUser;

    if (safetyPhrase !== values.safetyPhrase) {
      toast.error('Frase de Segurança Invalida.', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else if (organization?.nome !== values.organizationName) {
      toast.error('Nome do Workspace Invalido.', {
        ...toastOptions,
        toastId: 'invalidOrganizationName',
      });
    } else if (organization) {
      window.electron.ipcRenderer.sendMessage('leaveOrganization', {
        organizationId: organization._id,
      });
    }
  }

  const formikProps = useFormik({
    initialValues: LeaveOrganizationInitialValues,
    validationSchema: LeaveOrganizationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  useEffect(() => {
    if (isCloseModal) {
      changeModal(false);
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
      <div className={styles.leaveOrganization}>
        <h2>
          Deseja realmente sair de <br /> <span>{organization?.nome}</span>?{' '}
        </h2>
        <form onSubmit={formikProps.handleSubmit}>
          <InputAnimated
            text="Confirme o nome do workspace que deseja Sair"
            name="organizationName"
            value={formikProps.values.organizationName}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          {formikProps.errors.organizationName &&
            formikProps.touched.organizationName && (
              <p className={styles.formError}>
                {formikProps.errors.organizationName}
              </p>
            )}
          <InputAnimated
            text="Frase Secreta"
            type="password"
            name="safetyPhrase"
            value={formikProps.values.safetyPhrase}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          {formikProps.errors.safetyPhrase &&
            formikProps.touched.safetyPhrase && (
              <p className={styles.formError}>
                {formikProps.errors.safetyPhrase}
              </p>
            )}
          <ButtonLoading
            text="Sair"
            type="submit"
            isLoading={buttonIsLoading}
          />
          <ButtonLoading text="Cancelar" onClick={onRequestClose} />
        </form>
      </div>
    </ReactModal>
  );
}
