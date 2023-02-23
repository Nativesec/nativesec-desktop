/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ColorPicker from 'react-best-gradient-color-picker';
import { useFormik } from 'formik';

import ButtonOutlined from 'renderer/components/Buttons/ButtonOutlined';

import { MdDeleteForever } from 'react-icons/md';
import { BiExit, BiSave } from 'react-icons/bi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import browserImageSize from 'browser-image-size';
import { IUser } from 'main/types';

import { SettingsOrganizationInitialValues } from 'renderer/utils/validations/Yup/SettingsOrganization';
import { IOrganization } from 'renderer/hooks/useOrganization/types';
import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import Input from 'renderer/components/Inputs/Input';
import TextArea from 'renderer/components/TextArea/TextArea';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import { IChangeOrganization } from '../types';

import { LeaveOrganizationModal } from './LeaveOrganizationModal';
import { DeleteOrganizationModal } from './DeleteOrganizatioModal';

import styles from './styles.module.sass';

import uploadImage from '../../../../../assets/images/upload.png';

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function Settings() {
  const { currentOrganization, currentOrganizationIcon } =
    useContext(OrganizationsContext);
  const { theme } = useContext(ThemeContext);
  const [messageError, setMessageError] = useState<string | undefined>(
    undefined
  );
  const [updatedIcon, setUpdatedIcon] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState<boolean>(false);
  const [myFiles, setMyFiles] = useState<string>();
  const { myEmail } = window.electron.store.get('user') as IUser;

  const onSubmit = (values: IChangeOrganization) => {
    window.electron.ipcRenderer.sendMessage('changeOrganization', {
      organizationId: currentOrganization?._id,
      icon: values.icon === '' ? null : values.icon,
      updateDate: currentOrganization?.data_atualizacao,
      name: values.name,
      description: values.description,
      theme: JSON.stringify({
        mainColor: values.mainColor,
        secondColor: values.secondColor,
      }),
      limitUsers: currentOrganization?.limite_usuarios,
      storageLimit: currentOrganization?.limite_armazenamento,
      ownerEmail: currentOrganization?.dono,
      adminGuests: currentOrganization?.convidados_administradores,
      participantGuests: currentOrganization?.convidados_participantes,
      participants: currentOrganization?.participantes,
      admins: currentOrganization?.administradores,
      deleted: currentOrganization?.deletado,
    });
  };

  const formikProps = useFormik({
    initialValues: SettingsOrganizationInitialValues,
    onSubmit: (values) => onSubmit(values),
    enableReinitialize: true,
  });

  useEffect(() => {
    setMessageError(undefined);
    if (currentOrganization && currentOrganizationIcon !== undefined) {
      setMyFiles(undefined);
      formikProps.setFieldValue('name', currentOrganization.nome);
      formikProps.setFieldValue('description', currentOrganization.descricao);
      formikProps.setFieldValue(
        'mainColor',
        JSON.parse(currentOrganization.tema).mainColor
      );
      formikProps.setFieldValue(
        'secondColor',
        JSON.parse(currentOrganization.tema).secondColor
      );
      formikProps.setFieldValue('icon', currentOrganizationIcon.icone);
    }
  }, [currentOrganization, currentOrganizationIcon]);

  const handleUploadImage = async (e: File[]): Promise<string> => {
    return String(await toBase64(e[0]));
  };

  const handleDiscard = () => {
    const orgInitial = window.electron.store.get(
      'organizations'
    ) as IOrganization[];
    setMessageError(undefined);
    const find = orgInitial.filter(
      (item) => item._id === currentOrganization?._id
    )[0];

    formikProps.setFieldValue('name', find.nome);
    formikProps.setFieldValue('description', find.descricao);
    formikProps.setFieldValue('mainColor', JSON.parse(find.tema).mainColor);
    formikProps.setFieldValue('secondColor', JSON.parse(find.tema).secondColor);
    formikProps.setFieldValue('icon', String(updatedIcon));
  };

  const handleOpenDeleteModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setModalIsOpen(false);
  };

  const handleOpenLeaveModal = () => {
    setLeaveModalIsOpen(true);
  };

  const handleCloseLeaveModal = () => {
    setLeaveModalIsOpen(false);
  };

  useEffect(() => {
    if (currentOrganizationIcon) {
      setUpdatedIcon(currentOrganizationIcon.icone);
    }
  }, [currentOrganizationIcon]);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (
      acceptedFiles[0].type === 'image/png' ||
      acceptedFiles[0].type === 'image/jpeg' ||
      acceptedFiles[0].type === 'image/jpg'
    ) {
      const imageSize = await browserImageSize(acceptedFiles[0]).then(
        (result: any) => {
          return result;
        }
      );
      if (imageSize.width > 512 || imageSize.height > 512) {
        setMessageError('Tamanho máximo 512x512');
      } else {
        setMessageError(undefined);
        const image = await handleUploadImage(acceptedFiles);
        setMyFiles(image);
        await formikProps.setFieldValue('icon', image);
      }
    }
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  return (
    <>
      <DeleteOrganizationModal
        isOpen={modalIsOpen}
        currentTheme={theme}
        organization={currentOrganization}
        onRequestClose={handleCloseDeleteModal}
      />
      <LeaveOrganizationModal
        isOpen={leaveModalIsOpen}
        currentTheme={theme}
        organization={currentOrganization}
        onRequestClose={handleCloseLeaveModal}
      />
      <div
        className={`${styles.settings} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.container}>
          {JSON.parse(currentOrganization?.participantes as string)?.filter(
            (item: string) => {
              if (item === myEmail) {
                return myEmail;
              }
              return undefined;
            }
          ).length === 0 && (
            <form onSubmit={formikProps.handleSubmit}>
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <img
                    src={`${
                      formikProps.values.icon === 'null' ||
                      formikProps.values.icon === null
                        ? uploadImage
                        : formikProps.values.icon
                    }`}
                    alt="Enviar Imagem"
                  />
                </div>
                {messageError !== undefined ? (
                  <p className={styles.error}>{messageError}</p>
                ) : formikProps.values.icon === 'null' ||
                  formikProps.values.icon === null ? (
                  <p className={styles.name_file}>Insira uma nova imagem</p>
                ) : myFiles === undefined ? (
                  <p>Altere a imagem</p>
                ) : (
                  <p>{acceptedFiles[0]?.name}</p>
                )}
              </section>
              <h5>Nome</h5>
              <Input
                name="name"
                placeholder="Nome da Organização"
                value={formikProps.values.name}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
              />
              <h5>Descriçao</h5>
              <TextArea
                name="description"
                placeholder="Descrição"
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
              />
              <div className={styles.pickColor}>
                <div>
                  <h4>Cor Principal</h4>
                  <ColorPicker
                    name="mainColor"
                    id="mainColor"
                    width={150}
                    height={150}
                    onChange={(e: string) =>
                      formikProps.setFieldValue &&
                      formikProps.setFieldValue('mainColor', e)
                    }
                    value={formikProps.values.mainColor}
                    hidePresets
                    hideControls
                    hideInputs
                  />
                </div>
                <div>
                  <h4>Cor Secundaria</h4>
                  <ColorPicker
                    name="secondColor"
                    id="secondColor"
                    width={150}
                    height={150}
                    onChange={(e: string) =>
                      formikProps.setFieldValue &&
                      formikProps.setFieldValue('secondColor', e)
                    }
                    value={formikProps.values.secondColor}
                    hidePresets
                    hideControls
                    hideInputs
                  />
                </div>
              </div>
              <div className={styles.submit}>
                <ButtonOutlined
                  type="button"
                  text="Descartar"
                  Icon={AiOutlineCloseCircle}
                  onClick={handleDiscard}
                />
                <ButtonOutlined text="Salvar" Icon={BiSave} type="submit" />
              </div>
            </form>
          )}
          <div className={styles.containerOptions}>
            {JSON.parse(currentOrganization?.participantes as string)?.map(
              (item: string) => item === myEmail
            ).length === 0 && (
              <div className={styles.option}>
                <div>
                  <h3>Excluir Workspace</h3>
                  <p>ATENÇÃO! Essa ação irá deletar seu workspace.</p>
                </div>
                <div className={styles.button}>
                  <ButtonOutlined
                    text="Deletar Workspace"
                    Icon={MdDeleteForever}
                    onClick={handleOpenDeleteModal}
                  />
                </div>
              </div>
            )}
            <div className={styles.option}>
              <div>
                <h3>Sair do Workspace</h3>
                <p>ATENÇÃO! Essa ação irá te remover do workspace. </p>
              </div>
              <div
                className={`${
                  currentOrganization?.dono === myEmail && styles.disabled
                }`}
              >
                <ButtonOutlined
                  text="Sair do Workspace"
                  Icon={BiExit}
                  disabled={currentOrganization?.dono === myEmail}
                  onClick={handleOpenLeaveModal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
