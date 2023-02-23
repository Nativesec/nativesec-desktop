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
  DeleteOrganizationInitialValues,
  DeleteOrganizationSchema,
} from 'renderer/utils/validations/Yup/DeleteOrganization';
import {
  IDeleteOrganization,
  IDeleteOrganizationModalProps,
} from '../../types';
import styles from './styles.module.sass';

export function DeleteOrganizationModal({
  isOpen,
  organization,
  currentTheme,
  onRequestClose,
}: IDeleteOrganizationModalProps) {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const { isCloseModal, changeModal } = useContext(ModalContext);

  function handleSubmit(values: IDeleteOrganization) {
    toast.dismiss('invalidSafetyPhrase');
    const { safetyPhrase } = window.electron.store.get('user') as IUser;

    if (values.safetyPhrase !== safetyPhrase) {
      toast.error('Frase Secreta Invalida.', {
        ...toastOptions,
        toastId: 'invalidSafetyPhrase',
      });
    } else {
      setButtonIsLoading(true);
      if (organization) {
        window.electron.ipcRenderer.sendMessage('deleteOrganization', {
          organizationId: organization._id,
        });
      }
    }
  }

  const formikProps = useFormik({
    initialValues: DeleteOrganizationInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: DeleteOrganizationSchema,
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
      <div className={styles.deleteWorkspace}>
        <h2>
          Deseja realmente apagar <span> {organization?.nome} </span>?
        </h2>
        <form onSubmit={formikProps.handleSubmit}>
          <InputAnimated
            text="Confirme o nome do workspace que deseja excluir"
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
            text="Frase secreta"
            name="safetyPhrase"
            type="password"
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
            text="Excluir"
            type="submit"
            isLoading={buttonIsLoading}
          />
          <ButtonLoading text="Cancelar" onClick={onRequestClose} />
        </form>
      </div>
    </ReactModal>
  );
}
