/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

import { IUserConfig } from 'main/ipc/user/types';

import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import WorkspacesIcon from './WorkspacesIcons';

import styles from './styles.module.sass';

interface SidebarProps {
  isLoading: boolean;
}

export function Sidebar({ isLoading }: SidebarProps) {
  const {
    organizations,
    organizationsIcons,
    organizationsInvites,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [update, setUpdate] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [height, setHeight] = useState(window.innerHeight);
  const [counter, setCounter] = useState<number>(0);
  const prev = document.getElementById('buttonTop') as HTMLElement;
  const next = document.getElementById('buttonBottom') as HTMLElement;
  const slider = document.getElementById('workspaces') as HTMLElement;

  // if (organizations?.length * 64 > height && prev !== null && next !== null) {
  //   slider.scrollTop -= 300;
  //   next.style.opacity = '0';
  //   next.style.zIndex = '-1';
  //   prev.style.opacity = '1';
  //   prev.style.zIndex = '3001';
  //   if (counter > 0) {
  //     next.style.opacity = '0';
  //     next.style.zIndex = '-1';
  //     prev.style.opacity = '1';
  //     prev.style.zIndex = '3001';
  //   } else {
  //     prev.style.opacity = '0';
  //     prev.style.zIndex = '-1';
  //     next.style.opacity = '1';
  //     next.style.zIndex = '3001';
  //   }
  // } else if (prev !== null && next !== null) {
  //   prev.style.opacity = '0';
  //   prev.style.zIndex = '-1';
  //   next.style.opacity = '0';
  //   next.style.zIndex = '-1';
  // }

  // const handleButtomTop = () => {
  //   setCounter(0);
  //   prev.style.opacity = '0';
  //   prev.style.zIndex = '-1';
  //   next.style.opacity = '1';
  //   next.style.zIndex = '3001';
  //   slider.scrollTop -= 300;
  // };

  // const handleButtomBottom = () => {
  //   setCounter(1);
  //   prev.style.opacity = '1';
  //   prev.style.zIndex = '3001';
  //   next.style.opacity = '0';
  //   next.style.zIndex = '-1';
  //   slider.scrollTop += 300;
  // };

  useEffect(() => {
    if (slider) {
      window.addEventListener('resize', handleSliderSizeChange);
    }
    if (organizations?.length * 64 < height) {
      setCounter(0);
    }
  }, [window.innerHeight, organizations]);

  const handleSliderSizeChange = () => {
    setHeight(slider.offsetHeight);
  };

  const handleNewWorkspace = () => {
    navigate('/createWorkspace');
  };

  const handleWorkspace = (orgId: string) => {
    const userConfig = {
      ...window.electron.store.get('userConfig'),
      lastOrganizationId: orgId,
    } as IUserConfig;

    changeCurrentOrganization(orgId);

    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.UPDATE_USER_CONFIG,
      data: {
        lastOrganizationId: orgId,
        refreshTime: userConfig.refreshTime,
        savePrivateKey: userConfig.savePrivateKey,
        theme: userConfig.theme,
      },
    });

    navigate(`/workspace/${orgId}`);

    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId: orgId,
    });
  };

  const handleMyInvites = () => {
    navigate('/invites');
  };

  useEffect(() => {
    if (
      window.electron.store.get('token')?.accessToken !== undefined &&
      window.electron.store.get('user')?.safetyPhrase !== undefined &&
      window.electron.store.get('keys')?.privateKey !== undefined
    ) {
      const timer = setTimeout(() => {
        setUpdate(!update);
      }, 30 * 1000); // 30 seconds
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
        data: {
          type: 'refresh',
        },
      });
      window.electron.ipcRenderer.sendMessage('refreshToken', []);
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.GET_MY_INVITES,
      });
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [update, isLoading]);

  return (
    <>
      <div
        className={`${styles.sidebar} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.workspaces} id="workspaces">
          {organizationsInvites.length > 0 && (
            <WorkspacesIcon
              onClick={handleMyInvites}
              icon={null}
              type="invite"
              className={
                location.pathname === '/invites' ? styles.selectedInvite : ''
              }
            />
          )}
          {organizations?.map((org) => (
            <WorkspacesIcon
              icon={
                organizationsIcons?.filter((icon) => icon._id === org?._id)[0]
                  ?.icone
              }
              className={id === org?._id ? styles.selected : ''}
              workspaceName={org?.nome}
              key={org?._id}
              onClick={() => handleWorkspace(org?._id)}
              data-tooltip="teste"
            />
          ))}
        </div>
        {/* <div className={styles.buttonsSlider}>
          <button
            className={styles.buttonTop}
            id="buttonTop"
            onClick={() => handleButtomTop()}
          >
            <MdOutlineKeyboardArrowUp />
          </button>
          <button
            className={styles.buttonBottom}
            id="buttonBottom"
            onClick={() => handleButtomBottom()}
          >
            <MdOutlineKeyboardArrowDown />
          </button>
        </div> */}
        <div className={styles.buttonShowText}>
          <button
            type="button"
            onClick={handleNewWorkspace}
            data-tooltip="Novo Workspace"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}
