/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { toast } from 'react-toastify';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import {
  MdOutlineAdd,
  MdOutlineAlternateEmail,
  MdOutlinePassword,
} from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { CgWebsite } from 'react-icons/cg';
import { FcSafe, FcViewDetails, FcSimCardChip } from 'react-icons/fc';
import { GiSuitcase } from 'react-icons/gi';
import { HiUsers, HiTerminal } from 'react-icons/hi';
import { FaServer, FaMoneyCheckAlt } from 'react-icons/fa';
import { IoMdSettings, IoIosRefresh } from 'react-icons/io';
import { RiFolderKeyholeFill } from 'react-icons/ri';
import { SiKubernetes } from 'react-icons/si';
import { TbLicense, TbCloudDataConnection } from 'react-icons/tb';

import { toastOptions } from 'renderer/utils/options/Toastify';
import ButtonOutlined from 'renderer/components/Buttons/ButtonOutlined';

import { IUser } from 'main/types';
import LottieControl from 'renderer/components/LottieControl';

import { useIpcOrganization } from 'renderer/hooks/useOrganization/useIpcOrganization';
import { useIpcSafeBox } from 'renderer/hooks/useSafeBox/useIpcSafeBox';
import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/safeBoxesContext/SafeBoxesContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import * as types from './types';

import { CreateSafeBox } from './CreateSafeBox';
import { Settings } from './Settings';
import { Members } from './Members';
import { InviteMemberModal } from './Members/InviteMemberModal';

import NaviteLogo from '../../../../assets/logoNativesec/256.png';
import EmptyBox from '../../../../assets/svg/empty-box.svg';

import animationData from '../../../../assets/animationsJson/loading.json';

import styles from './styles.module.sass';
import { ChangeSafetyPhrase } from './ChangeSafetyPhrase';

export function Workspace({
  refreshTime,
  handleSetIsLoading,
}: types.IWorkspaceProps) {
  useIpcSafeBox();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateOrganizations, currentOrganization, currentOrganizationIcon } =
    useContext(OrganizationsContext);
  const {
    safeBoxes,
    updateSafeBoxes,
    currentSafeBox,
    changeCurrentSafeBox,
    safeBoxIsOpen,
    safeBoxesIsLoading,
    createSafeBoxIsLoading,
    changeSafeBoxIsOpen,
    changeSafeBoxesIsLoading,
    changeCreateSafeBoxIsLoading,
  } = useContext(SafeBoxesContext);
  const { theme } = useContext(ThemeContext);
  const { myEmail } = window.electron.store.get('user') as IUser;
  const menuRef = useRef<HTMLButtonElement>(null);
  const [update, setUpdate] = useState<boolean>(true);
  const [selected, setSelected] = useState<number>(1);
  const [openWorkspacesConfig, setOpenWorkspacesConfig] = useState(false);
  const [modalInviteIsOpen, setModalInviteIsOpen] = useState<boolean>(false);
  const [profileMenuIsOpen, setProfileMenuIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdate(!update);
    }, refreshTime * 1000);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.REFRESH_SAFEBOXES,
      data: {
        organizationId: currentOrganization?._id,
      },
    });
    return () => clearTimeout(timer);
  }, [update, refreshTime]);

  const handleModalInviteOpen = useCallback(() => {
    setModalInviteIsOpen(true);
  }, []);

  const handleModalInviteClose = useCallback(() => {
    setModalInviteIsOpen(false);
  }, []);

  function handleSelected(select: number) {
    if (select === 21 || select === 22) {
      setOpenWorkspacesConfig(true);
    } else {
      setOpenWorkspacesConfig(false);
    }
    setSelected(select);
    changeSafeBoxIsOpen(false);
  }

  function handleSelectSafeBox(safeBoxId: string, open: boolean) {
    const listSafeBox = window.electron.store.get('safebox');
    const filter = listSafeBox.filter(
      (box: types.ISafeBoxDatabase) => box._id === safeBoxId
    );
    if (filter.length > 0) {
      changeCurrentSafeBox(filter[0]);
    }
    changeSafeBoxIsOpen(open);
    changeCreateSafeBoxIsLoading(false);
  }

  function handleLeave() {
    window.electron.ipcRenderer.sendMessage('leave', []);
    window.electron.ipcRenderer.sendMessage('initialData', []);
    updateOrganizations([]);
    updateSafeBoxes([]);
    navigate('/');
  }

  const updateSafeBox = useCallback(() => {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.REFRESH_SAFEBOXES,
      data: {
        organizationId: currentOrganization?._id,
      },
    });
  }, [currentOrganization]);

  const handleNewItem = useCallback(() => {
    changeSafeBoxIsOpen(!safeBoxIsOpen);
    changeCreateSafeBoxIsLoading(false);
    changeCurrentSafeBox(undefined);
  }, [safeBoxIsOpen]);

  useEffect(() => {
    handleSetIsLoading(false);
  }, []);

  useEffect(() => {
    changeSafeBoxIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId: currentOrganization?._id,
    });
  }, [location.pathname]);

  function handleClickOutside(e: MouseEvent) {
    if (profileMenuIsOpen && !menuRef.current?.contains(e.target as Node)) {
      setProfileMenuIsOpen(false);
    }
  }

  function handleProfileMenuIsOpen() {
    setProfileMenuIsOpen(!profileMenuIsOpen);
  }

  window.addEventListener('click', handleClickOutside);
  return (
    <>
      <InviteMemberModal
        isOpen={modalInviteIsOpen}
        onRequestClose={handleModalInviteClose}
        orgId={currentOrganization?._id}
        currentTheme={theme}
      />
      <div
        className={`${styles.workspace} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.workspace_sidebar}>
          <div className={styles.title}>
            {currentOrganizationIcon?.icone !== null &&
            currentOrganizationIcon?.icone !== '' &&
            currentOrganizationIcon?.icone !== 'null' ? (
              <img src={currentOrganizationIcon?.icone} alt="icone" />
            ) : (
              <img src={NaviteLogo} alt="icone" />
            )}
            <h3>{currentOrganization?.nome}</h3>
          </div>
          <div className={styles.list}>
            <ul>
              <li
                className={`${selected === 1 && styles.selected}`}
                onClick={() => handleSelected(1)}
              >
                <RiFolderKeyholeFill />
                Cofre
              </li>
              <li onClick={() => handleSelected(21)}>
                <GiSuitcase />
                Workspaces
              </li>
              <ul
                className={`${styles.workspacesConfig} ${
                  !openWorkspacesConfig && styles.open
                }`}
              >
                <li
                  className={`${styles.subMenu} ${
                    selected === 21 && styles.selected
                  } `}
                  onClick={() => handleSelected(21)}
                >
                  <HiUsers />
                  Membros
                </li>
                <li
                  className={`${styles.subMenu} ${
                    selected === 22 && styles.selected
                  } `}
                  onClick={() => handleSelected(22)}
                >
                  <IoMdSettings />
                  Gerenciar
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className={styles.workspaceContent}>
          <div className={styles.workspaceContentMenu}>
            <div>
              {selected === 1 ? (
                <>
                  <div className={styles.buttonsWorkspace}>
                    <ButtonOutlined
                      text="Novo Item"
                      onClick={handleNewItem}
                      Icon={MdOutlineAdd}
                    />
                    <ButtonOutlined
                      text="Atualizar"
                      onClick={updateSafeBox}
                      Icon={IoIosRefresh}
                    />
                  </div>
                </>
              ) : (
                selected !== 22 &&
                selected !== 23 &&
                selected !== 24 && (
                  <>
                    {currentOrganization &&
                      JSON.parse(currentOrganization.participantes).filter(
                        (email: string) => email === myEmail
                      ).length === 0 && (
                        <div className={styles.buttonsWorkspace}>
                          <ButtonOutlined
                            text="Adicionar Participante"
                            onClick={handleModalInviteOpen}
                            Icon={MdOutlineAdd}
                          />
                        </div>
                      )}
                  </>
                )
              )}
            </div>
            <div className={styles.user}>
              <div className={styles.buttonUser}>
                <button
                  ref={menuRef}
                  type="button"
                  className={`${!profileMenuIsOpen && styles.button}`}
                  data-tooltip="Perfil"
                  onClick={handleProfileMenuIsOpen}
                >
                  <AiOutlineUser />
                </button>
              </div>
              {profileMenuIsOpen && (
                <div className={styles.profileMenu}>
                  <ul>
                    <li onClick={() => navigate('/usersSettings')}>
                      Configurações
                    </li>
                    <li onClick={() => handleSelected(24)}>
                      Trocar Frase Secreta
                    </li>
                    <li onClick={handleLeave}>Sair</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${safeBoxIsOpen ? styles.openCenter : ''} ${
              styles.workspaceContentSelected
            } ${selected === 1 ? styles.overflow : ''}`}
          >
            {selected === 21 && currentOrganization ? (
              <Members />
            ) : selected === 22 && currentOrganization ? (
              <Settings />
            ) : selected === 24 && currentOrganization ? (
              <ChangeSafetyPhrase currentTheme={theme} />
            ) : safeBoxesIsLoading ? (
              <div className={styles.safeBoxLoading}>
                <LottieControl animationData={animationData} play loop />
              </div>
            ) : safeBoxes.length === 0 ? (
              <div className={`${styles.emptySafeBox}`}>
                <ReactSVG src={EmptyBox} />
                <p>Não há nenhuma senha salva aqui</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {safeBoxes[0]?.organizacao === id &&
                  safeBoxes.map((box) => (
                    <div
                      className={`${styles.box} ${
                        currentSafeBox?._id === box._id && styles.selected
                      }`}
                      onClick={() => handleSelectSafeBox(box._id, true)}
                      key={box._id}
                    >
                      {box.tipo === 'bankAccount' ? (
                        <span className={styles.bankAccount}>
                          <FaMoneyCheckAlt />
                        </span>
                      ) : box.tipo === 'annotation' ? (
                        <span className={styles.annotation}>
                          <FcViewDetails />
                        </span>
                      ) : box.tipo === 'creditCard' ? (
                        <FcSimCardChip />
                      ) : box.tipo === 'email' ? (
                        <span className={styles.email}>
                          <MdOutlineAlternateEmail />
                        </span>
                      ) : box.tipo === 'kubeconfig' ? (
                        <span className={styles.kubeconfig}>
                          <SiKubernetes />
                        </span>
                      ) : box.tipo === 'softwareLicense' ? (
                        <span className={styles.softwareLicense}>
                          <TbLicense />
                        </span>
                      ) : box.tipo === 'login' ? (
                        <span className={styles.login}>
                          <MdOutlinePassword />
                        </span>
                      ) : box.tipo === 'ssh' ? (
                        <span className={styles.ssh}>
                          <HiTerminal />
                        </span>
                      ) : box.tipo === 'server' ? (
                        <span className={styles.server}>
                          <FaServer />
                        </span>
                      ) : box.tipo === 'site' ? (
                        <span className={styles.site}>
                          <CgWebsite />
                        </span>
                      ) : box.tipo === 'ftp' ? (
                        <span className={styles.site}>
                          <TbCloudDataConnection />
                        </span>
                      ) : (
                        <FcSafe />
                      )}
                      <h3>{box.nome}</h3>
                    </div>
                  ))}
              </div>
            )}
            <div className={`${styles.create} ${safeBoxIsOpen && styles.open}`}>
              {!createSafeBoxIsLoading ? (
                <CreateSafeBox isOpen={safeBoxIsOpen} />
              ) : (
                <div className={styles.lottieControl}>
                  <LottieControl animationData={animationData} play loop />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
