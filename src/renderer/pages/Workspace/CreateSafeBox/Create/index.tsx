/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-const */
/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/dot-notation */
import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Select, { MultiValue } from 'react-select';

import { IoMdSend } from 'react-icons/io';
import { MdDelete, MdModeEditOutline, MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';

import InputAnimated from 'renderer/components/Inputs/InputAnimated';
import TextAreaAnimated from 'renderer/components/TextArea/TextAreaAnimated';
import { toastOptions } from 'renderer/utils/options/Toastify';

import { IUser } from 'main/types';
import { SafeBoxesContext } from 'renderer/contexts/safeBoxesContext/SafeBoxesContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import * as types from '../../types';

import formikData from './formik';
import styles from './styles.module.sass';
import { VerifySafetyPhraseModal } from '../VerifySafetyPhraseModal';

const Create = ({ value, organization }: types.ICreateProps) => {
  const { theme } = useContext(ThemeContext);
  const { currentSafeBox, changeCreateSafeBoxIsLoading } =
    useContext(SafeBoxesContext);
  const [usersParticipant, setUsersParticipant] = useState<
    types.IParticipant[]
  >([]);
  const [usersAdmin, setUsersAdmin] = useState<types.IParticipant[]>([]);

  const [verifyPasswordModalIsOpen, setVerifyPasswordModalIsOpen] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [decryptMode, setDecryptMode] = useState<boolean>(false);
  const { myEmail } = window.electron.store.get('user') as IUser;
  const [initialValues, setInitialValues] = useState<types.IItem>([]);
  const [modeModal, setModeModal] = useState<string | undefined>(undefined);
  const [itemDecrypt, setItemDecrypt] = useState<
    types.IItemDecrypt | undefined
  >(undefined);
  const [selectOptions, setSelectOptions] = useState<types.IParticipant[]>([
    ...JSON.parse(organization.administradores).map((adm: string) => {
      return { value: adm, label: adm };
    }),
    ...JSON.parse(organization.participantes).map((adm: string) => {
      return { value: adm, label: adm };
    }),
    { value: organization.dono, label: organization.dono },
  ]);

  function handleSubmit(values: types.IItem) {
    changeCreateSafeBoxIsLoading(true);
    const size = values.length;
    const content = [];
    for (let i = 1; i < size - 1; i += 1) {
      content.push({
        [values[i]?.name as string]: values[i][`${values[i].name}`],
        crypto: values[i].crypto,
        name: values[i].name,
      });
    }

    let editUsersAdmin = usersAdmin.map((user) => user.label);
    let editUsersParticipant = usersParticipant.map((user) => user.label);

    const filterUsersAdmin = usersAdmin.filter(
      (user) => user.label === myEmail
    );
    const filterUsersParticipant = usersParticipant.filter(
      (user) => user.label === myEmail
    );

    let deletedUsersAdmin: string[] = JSON.parse(
      currentSafeBox?.usuarios_escrita_deletado || '[]'
    );
    let deletedUsersParticipant: string[] = JSON.parse(
      currentSafeBox?.usuarios_leitura_deletado || '[]'
    );

    if (currentSafeBox) {
      deletedUsersAdmin = JSON.parse(currentSafeBox.usuarios_escrita).filter(
        (user: string) => {
          return !editUsersAdmin.some((userAdmin) => {
            return userAdmin === user;
          });
        }
      );
      deletedUsersAdmin = deletedUsersAdmin.filter((deletedUser) => {
        return ![...editUsersParticipant, ...editUsersAdmin].some((users) => {
          return users === deletedUser;
        });
      });

      deletedUsersParticipant = JSON.parse(
        currentSafeBox.usuarios_leitura
      ).filter((user: string) => {
        return !editUsersParticipant.some((userParticipant) => {
          return userParticipant === user;
        });
      });
      deletedUsersParticipant = deletedUsersParticipant.filter(
        (deletedUser) => {
          return ![...editUsersParticipant, ...editUsersAdmin].some((users) => {
            return users === deletedUser;
          });
        }
      );
    }

    if (
      filterUsersAdmin.length === 0 &&
      filterUsersParticipant.length === 0 &&
      editUsersAdmin.length === 0
    ) {
      deletedUsersAdmin = deletedUsersAdmin.filter((user) => user !== myEmail);
      editUsersAdmin = [...editUsersAdmin, myEmail];
      editUsersParticipant = editUsersParticipant.filter(
        (email) => email !== myEmail
      );
    }

    if (!editMode) {
      window.electron.ipcRenderer.sendMessage('createSafeBox', {
        usuarios_leitura: editUsersParticipant,
        usuarios_escrita: editUsersAdmin,
        tipo: formikData[value].type,
        usuarios_leitura_deletado: [],
        usuarios_escrita_deletado: [],
        criptografia: 'rsa',
        nome: values[0][`${values[0].name}`],
        descricao: values[size - 1][`${values[size - 1].name}`],
        conteudo: content,
        organizacao: organization._id,
      });
    } else {
      window.electron.ipcRenderer.sendMessage('updateSafeBox', [
        {
          id: currentSafeBox?._id,
          usuarios_leitura: editUsersParticipant,
          usuarios_escrita: editUsersAdmin,
          usuarios_leitura_deletado: deletedUsersParticipant,
          usuarios_escrita_deletado: deletedUsersAdmin,
          tipo: formikData[value].type,
          criptografia: 'rsa',
          nome: values[0][`${values[0].name}`],
          descricao: values[size - 1][`${values[size - 1].name}`],
          conteudo: content,
          organizacao: organization._id,
          data_atualizacao: currentSafeBox?.data_atualizacao,
          data_hora_create: currentSafeBox?.data_hora_create,
        },
      ]);
    }
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

  const handleAddParticipant = (
    values: MultiValue<types.IParticipant>,
    type: 'admin' | 'participant'
  ) => {
    const selectValues = values as types.IParticipant[];
    const selectInitialValues = [
      ...JSON.parse(organization.administradores).map((email: string) => {
        return { value: email, label: email };
      }),
      ...JSON.parse(organization.participantes).map((email: string) => {
        return { value: email, label: email };
      }),

      { value: organization.dono, label: organization.dono },
    ];

    if (type === 'admin') {
      if (values.length < usersAdmin.length) {
        const filterOptions = selectInitialValues.filter(
          (so) =>
            ![...selectValues, ...usersParticipant].filter(
              (sv) => sv.label === so.label
            ).length
        );
        const filterSelected = selectInitialValues.filter(
          (so) => selectValues.filter((sv) => sv.label === so.label).length
        );
        setUsersAdmin(filterSelected);
        setSelectOptions(filterOptions);
        if (type === 'admin') {
          setUsersAdmin(filterSelected);
        } else {
          setUsersParticipant(filterSelected);
        }
      } else if (values.length > 0) {
        const filterOptions = selectOptions.filter(
          (so) => !selectValues.filter((sv) => sv.label === so.label).length
        );

        setSelectOptions(filterOptions);
        setUsersAdmin([
          ...usersAdmin,
          {
            email: values[values.length - 1].label,
            type,
            value: values[values.length - 1].label,
            label: values[values.length - 1].label,
          },
        ]);
      }
    } else if (type === 'participant') {
      if (values.length < usersParticipant.length) {
        const filterOptions = selectInitialValues.filter(
          (so) =>
            ![...selectValues, ...usersAdmin].filter(
              (sv) => sv.label === so.label
            ).length
        );
        const filterSelected = selectInitialValues.filter(
          (so) => selectValues.filter((sv) => sv.label === so.label).length
        );
        setUsersParticipant(filterSelected);
        setSelectOptions(filterOptions);
      } else if (values.length > 0) {
        const filterOptions = selectOptions.filter(
          (so) => !selectValues.filter((sv) => sv.label === so.label).length
        );
        setSelectOptions(filterOptions);
        setUsersParticipant([
          ...usersParticipant,
          {
            email: values[values.length - 1].label,
            type,
            value: values[values.length - 1].label,
            label: values[values.length - 1].label,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    setEditMode(false);
    formikProps.resetForm();
    let mySafeBox: types.IItem;
    if (currentSafeBox !== undefined) {
      mySafeBox = JSON.parse(currentSafeBox?.conteudo as string);
    }

    let myValues = formikData[value].item;

    myValues.map((item: types.IItem) => {
      if (currentSafeBox !== undefined) {
        if (item.name === 'description') {
          item['description'] = currentSafeBox?.descricao;
        } else if (item.name === 'formName') {
          item['formName'] = currentSafeBox?.nome;
        } else {
          item[`${item.name}`] = mySafeBox[`${item.name}`];
          if (item[`crypto`] !== undefined) {
            if (
              item[`${item.name}`]?.startsWith('-----BEGIN PGP MESSAGE-----')
            ) {
              item[`crypto`] = true;
              item[`${item.name}`] = '******************';
            } else {
              item[`crypto`] = false;
            }
          }
          if (item[`${item.name}`] === undefined) {
            item[`${item.name}`] = '';
          }
        }
      } else {
        item[`${item.name}`] = '';
      }

      return item;
    });
    if (currentSafeBox !== undefined) {
      const safeBoxUsersParticipant = JSON.parse(
        currentSafeBox?.usuarios_leitura
      ).map((email: string) => {
        return {
          email,
          type: 'participant',
          value: email,
          label: email,
        };
      });

      const safeBoxUsersAdmin = JSON.parse(
        currentSafeBox?.usuarios_escrita
      ).map((email: string) => {
        return {
          email,
          type: 'admin',
          value: email,
          label: email,
        };
      });

      handleAddParticipant(safeBoxUsersAdmin, 'admin');

      const filterOptions = selectOptions.filter(
        (so) =>
          !safeBoxUsersAdmin.filter(
            (sv: types.IParticipant) => sv.label === so.label
          ).length
      );
      setSelectOptions(filterOptions);
      setUsersAdmin(safeBoxUsersAdmin);
      setUsersParticipant(safeBoxUsersParticipant);
    } else {
      const currentUser: any = {
        email: myEmail,
        type: 'admin',
        value: myEmail,
        label: myEmail,
        disable: false,
      };
      const filterOptions = selectOptions.filter(
        (so) => so.label !== currentUser.email
      );
      setSelectOptions(filterOptions);
      setUsersAdmin([currentUser]);
    }

    setInitialValues(myValues);
  }, [value, currentSafeBox]);

  const handleEdit = (mode: boolean, type: 'decrypt' | 'edit') => {
    if (currentSafeBox !== undefined) {
      if (mode) {
        formikProps.values.forEach((_element: string, index: number) => {
          if (
            JSON.parse(currentSafeBox.conteudo)[
              `${formikProps.values[index].name}`
            ] !== undefined
          ) {
            if (
              JSON.parse(currentSafeBox.conteudo)[
                `${formikProps.values[index].name}`
              ].startsWith('-----BEGIN PGP MESSAGE-----')
            ) {
              window.electron.ipcRenderer.sendMessage('decrypt', [
                JSON.parse(currentSafeBox.conteudo)[
                  `${formikProps.values[index].name}`
                ],
                formikProps.values[index].name,
                `${index}.${formikProps.values[index].name}`,
              ]);
            }
          }
        });
        if (type === 'edit') {
          setEditMode(true);
        } else {
          setDecryptMode(true);
        }
      } else {
        formikProps.values.forEach((_element: string, index: number) => {
          if (
            JSON.parse(currentSafeBox.conteudo)[
              `${formikProps.values[index].name}`
            ] !== undefined
          ) {
            if (
              JSON.parse(currentSafeBox.conteudo)[
                `${formikProps.values[index].name}`
              ].startsWith('-----BEGIN PGP MESSAGE-----')
            ) {
              formikProps.setFieldValue(
                `${index}.${formikProps.values[index].name}`,
                '******************'
              );
            }
          }
        });
        if (type === 'edit') {
          setEditMode(false);
        } else {
          setDecryptMode(false);
        }
      }
    }
  };

  const handleDeleteSafeBox = () => {
    changeCreateSafeBoxIsLoading(true);
    window.electron.ipcRenderer.sendMessage('deleteSafeBox', {
      organizationId: organization._id,
      safeBoxId: currentSafeBox?._id,
    });
  };

  const decrypt = () => {
    if (
      currentSafeBox !== undefined &&
      JSON.parse(currentSafeBox.conteudo)[
        `${itemDecrypt?.itemName}`
      ].startsWith('-----BEGIN PGP MESSAGE-----')
    ) {
      if (!editMode) {
        if (itemDecrypt?.text.startsWith('*****')) {
          window.electron.ipcRenderer.sendMessage('decrypt', [
            JSON.parse(currentSafeBox.conteudo)[`${itemDecrypt?.itemName}`],
            itemDecrypt?.itemName,
            itemDecrypt?.position,
            modeModal,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('decrypt-response', async (result) => {
      const myResult = result as types.IDecryptedMessage;
      if (myResult.type === 'copy') {
        await navigator.clipboard.writeText(myResult.decrypted);
        toast.info('Campo copiado', { ...toastOptions, toastId: 'copied' });
      } else {
        await formikProps.setFieldValue(
          `${myResult.position}`,
          myResult.decrypted
        );
      }
    });
  }, []);

  const handleCloseVerifyPasswordModal = () => {
    setVerifyPasswordModalIsOpen(false);
  };

  function handleOpenVerifyPasswordModal(mode: string) {
    if (mode === 'decrypt' && decryptMode) {
      handleEdit(false, 'decrypt');
    } else {
      setModeModal(mode);
      setVerifyPasswordModalIsOpen(true);
    }
  }

  function handleDecrypt(text: string, itemName: string, position: string) {
    setItemDecrypt({ text, itemName, position });
    if (!text.startsWith('******')) {
      const myValues: types.IItem = formikData[value].item;
      myValues.map(() => {
        formikProps.setFieldValue(`${position}`, '******************');
        return position;
      });
    } else {
      setModeModal('decryptOne');
      setVerifyPasswordModalIsOpen(true);
    }
  }

  function handleDiscard() {
    formikProps.resetForm();
    handleEdit(false, 'edit');
    if (currentSafeBox !== undefined) {
      const currentUsers: types.IParticipant[] = [];
      const currentUsersAdmin: types.IParticipant[] = [];
      JSON.parse(currentSafeBox?.usuarios_leitura).forEach((email: string) => {
        currentUsers.push({
          email,
          type: 'participant',
          label: email,
          value: email,
        });
      });
      JSON.parse(currentSafeBox?.usuarios_escrita).forEach((email: string) => {
        currentUsersAdmin.push({
          email,
          type: 'admin',
          value: email,
          label: email,
        });
      });
      setUsersParticipant(currentUsers);
      setUsersAdmin(currentUsersAdmin);
    }
  }

  async function handleCopy(text: string, itemName: string, position: string) {
    if (!text.startsWith('*****')) {
      await navigator.clipboard.writeText(text);
      toast.info('Campo copiado', { ...toastOptions, toastId: 'copied' });
    } else {
      setModeModal('copy');
      setItemDecrypt({ text, itemName, position });
      setVerifyPasswordModalIsOpen(true);
    }
  }

  return (
    <>
      <VerifySafetyPhraseModal
        mode={modeModal}
        safeBoxName={currentSafeBox?.nome}
        setEditMode={handleEdit}
        currentTheme={theme}
        isOpen={verifyPasswordModalIsOpen}
        handleDeleteSafeBox={handleDeleteSafeBox}
        onRequestClose={handleCloseVerifyPasswordModal}
        decrypt={decrypt}
      />
      <div
        className={`${styles.create} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.actions}>
          {currentSafeBox === undefined || editMode ? (
            <>
              <button
                type="button"
                data-tooltip="Descartar"
                onClick={handleDiscard}
              >
                <MdDelete />
              </button>
              <button
                type="submit"
                onClick={formikProps.submitForm}
                data-tooltip="Enviar"
              >
                <IoMdSend />
              </button>
            </>
          ) : (
            <>
              {JSON.parse(currentSafeBox?.usuarios_leitura).filter(
                (email: string) => {
                  if (email === myEmail) {
                    return email;
                  }
                  return undefined;
                }
              ).length === 0 && (
                <>
                  <button
                    type="button"
                    data-tooltip="Excluir"
                    onClick={() => handleOpenVerifyPasswordModal('delete')}
                  >
                    <MdDelete />
                  </button>
                  <button
                    type="button"
                    data-tooltip="Editar"
                    onClick={() => handleOpenVerifyPasswordModal('edit')}
                    className={styles.edit}
                  >
                    <MdModeEditOutline />
                  </button>
                </>
              )}
              {formikProps.initialValues.filter((item: types.IItem) => {
                if (item.crypto === true) {
                  return [item];
                }
                return undefined;
              }).length > 0 && (
                <button
                  type="button"
                  data-tooltip={
                    decryptMode ? 'Criptografar' : 'Descriptografar'
                  }
                  onClick={() => handleOpenVerifyPasswordModal('decrypt')}
                >
                  {decryptMode ? <GiPadlock /> : <GiPadlockOpen />}
                </button>
              )}
            </>
          )}
        </div>
        <>
          {formikProps.initialValues.map((item: types.IItem, index: number) => (
            <div className={styles.crypto} key={index}>
              {item.element === 'input' ? (
                <InputAnimated
                  text={formikProps.values[index].text}
                  name={formikProps.values[index].name}
                  onChange={(e) => {
                    formikProps.setFieldValue(
                      `${index}.${item.name}`,
                      e.target.value
                    );
                  }}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values[index][`${item.name}`]}
                  disabled={currentSafeBox !== undefined && !editMode}
                  theme={theme}
                />
              ) : (
                <TextAreaAnimated
                  text={item.text}
                  name={`${index}.${item.name}`}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values[index][`${item.name}`]}
                  disabled={currentSafeBox !== undefined && !editMode}
                  theme={theme}
                />
              )}
              {!formikProps.values[index][`${item.name}`]?.startsWith('***') &&
                !editMode &&
                formikProps.values[index].crypto !== undefined &&
                formikProps.values[index].crypto !== false &&
                currentSafeBox !== undefined && (
                  <>
                    <MdContentCopy
                      onClick={() =>
                        handleCopy(
                          formikProps.values[index][`${item.name}`],
                          String(item.name),
                          `${index}.${item.name}`
                        )
                      }
                    />
                    <AiFillEye
                      onClick={() => {
                        {
                          currentSafeBox !== undefined &&
                            handleDecrypt(
                              formikProps.values[index][`${item.name}`],
                              String(item.name),
                              `${index}.${item.name}`
                            );
                        }
                      }}
                    />
                  </>
                )}
              {currentSafeBox !== undefined &&
              formikProps.values[index][`${item.name}`]?.startsWith('***') &&
              !editMode &&
              formikProps.values[index].crypto === true ? (
                <>
                  <MdContentCopy
                    onClick={() =>
                      handleCopy(
                        formikProps.values[index][`${item.name}`],
                        String(item.name),
                        `${index}.${item.name}`
                      )
                    }
                  />
                  <AiFillEyeInvisible
                    onClick={() => {
                      {
                        currentSafeBox !== undefined &&
                          handleDecrypt(
                            formikProps.values[index][`${item.name}`],
                            String(item.name),
                            `${index}.${item.name}`
                          );
                      }
                    }}
                  />
                </>
              ) : (
                currentSafeBox !== undefined &&
                formikProps.values[index][`${item.name}`]?.startsWith('***') &&
                formikProps.values[index].crypto === false &&
                !editMode && (
                  <>
                    <AiFillEye
                      onClick={() => {
                        {
                          currentSafeBox !== undefined &&
                            handleDecrypt(
                              formikProps.values[index][`${item.name}`],
                              String(item.name),
                              `${index}.${item.name}`
                            );
                        }
                      }}
                    />
                  </>
                )
              )}

              {currentSafeBox !== undefined &&
              editMode &&
              formikProps.values[index].crypto === false ? (
                <GiPadlockOpen
                  onClick={() => {
                    {
                      formikProps.setFieldValue(`${index}.crypto`, true);
                    }
                  }}
                />
              ) : (
                currentSafeBox !== undefined &&
                formikProps.values[index].crypto === true &&
                editMode && (
                  <GiPadlock
                    onClick={() => {
                      {
                        formikProps.setFieldValue(`${index}.crypto`, false);
                      }
                    }}
                  />
                )
              )}

              {currentSafeBox === undefined &&
              formikProps.values[index].crypto === false ? (
                <GiPadlockOpen
                  onClick={() => {
                    {
                      formikProps.setFieldValue(`${index}.crypto`, true);
                    }
                  }}
                />
              ) : (
                currentSafeBox === undefined &&
                formikProps.values[index].crypto === true && (
                  <GiPadlock
                    onClick={() => {
                      {
                        formikProps.setFieldValue(`${index}.crypto`, false);
                      }
                    }}
                  />
                )
              )}
            </div>
          ))}
        </>

        <div className={styles.inputParticipants}>
          <div className={styles.input}>
            <p>Participantes</p>
            <Select
              value={usersParticipant}
              options={selectOptions}
              className={styles.selectSearch}
              classNamePrefix="mySelect"
              isDisabled={currentSafeBox !== undefined && !editMode}
              isOptionDisabled={() => false}
              placeholder="Participantes"
              noOptionsMessage={() => 'Nenhum usuario'}
              isMulti
              theme={(themes) => ({
                ...themes,
                borderRadius: 7,
                colors: {
                  ...themes.colors,
                  primary: theme === 'dark' ? '#000000' : '#e3e5e8',
                  primary25: theme === 'light' ? '#e3e5e8' : '#2f3136',
                  neutral5: '#FFFFFF',
                },
              })}
              onChange={(e) => handleAddParticipant(e, 'participant')}
            />
          </div>
          <div className={styles.input}>
            <p>Administradores</p>
            <Select
              value={usersAdmin}
              options={selectOptions}
              className={styles.selectSearch}
              classNamePrefix="mySelect"
              isDisabled={currentSafeBox !== undefined && !editMode}
              placeholder="Administradores"
              noOptionsMessage={() => 'Nenhum usuario'}
              isMulti
              theme={(themes) => ({
                ...themes,
                borderRadius: 7,
                colors: {
                  ...themes.colors,
                  primary: JSON.parse(organization.tema).secondColor,
                  primary25: theme === 'light' ? '#e3e5e8' : '#737373',
                  neutral5: '#FFFFFF',
                },
              })}
              onChange={(e) => handleAddParticipant(e, 'admin')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
