/* eslint-disable react-hooks/exhaustive-deps */
import { IUserConfig } from 'main/ipc/user/types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import Loading from 'renderer/components/Loading';
import { OrganizationsContext } from 'renderer/contexts/organizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import { IDefaultApiResult } from 'renderer/types';
import SafetyPharase from './SafetyPharase';
import SearchKey from './SearchKey/index';
import styles from './styles.module.sass';
import { IHomeProps } from './types';

export interface IVerifyPrivateKey {
  status: string;
  chaveValida: boolean;
}

export function Home({
  isLoading,
  handleRefreshTime,
  handleSetIsLoading,
}: IHomeProps) {
  const {
    organizations,
    updateOrganizations,
    updateOrganizationsIcons,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);
  const { changeTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [safetyPhrase, setSafetyPhrase] = useState<boolean>(false);
  const [isValidPrivateKey, setIsValidPrivateKey] = useState<boolean>(false);
  const [verifiedSafetyPhrase, setVerifiedSafetyPhrase] =
    useState<boolean>(false);

  const handleIsValidPrivateKey = useCallback((pub: boolean) => {
    if (pub === true) {
      setIsValidPrivateKey(true);
    }
  }, []);

  const handleVerifiedSafetyPhrase = useCallback((verified: boolean) => {
    setVerifiedSafetyPhrase(verified);
  }, []);

  const handleSafetyPhrase = useCallback((phrase: boolean) => {
    setSafetyPhrase(phrase);
  }, []);

  const handleEnter = () => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.INITIALIZEDB,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.INITIALIZEDB_RESPONSE, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_DATABASE,
      });
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.UPDATE_DATABASE_RESPONSE, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.GET_USER,
      });
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_USER_RESPONSE,
      (result: IDefaultApiResult) => {
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.INSERT_DATABASE_KEYS,
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
      (result) => {
        const myResult = result as IDefaultApiResult;
        switch (myResult.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
      () => {
        updateOrganizationsIcons(window.electron.store.get('iconeAll'));
        updateOrganizations(window.electron.store.get('organizations'));
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.SET_USER_CONFIG,
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once(IPCTypes.SET_USER_CONFIG_RESPONSE, () => {
      const userConfig = window.electron.store.get('userConfig') as IUserConfig;
      handleRefreshTime(Number(userConfig.refreshTime));
      changeTheme(userConfig.theme);
      if (userConfig.lastOrganizationId === null) {
        navigate('/createWorkspace');
      } else {
        const filter = organizations?.filter((org) => {
          if (org._id === userConfig.lastOrganizationId) {
            return org;
          }
          return undefined;
        });
        if (filter.length > 0) {
          changeCurrentOrganization(userConfig.lastOrganizationId);
          navigate(`/workspace/${userConfig.lastOrganizationId}`);
        } else {
          navigate('/createWorkspace');
        }
      }
    });
  }, [organizations]);

  return (
    <>
      {isLoading && <Loading />}
      <div className={styles.home}>
        {safetyPhrase === true ? (
          isValidPrivateKey === true ? (
            <></>
          ) : (
            <SearchKey
              handleIsValidPrivateKey={handleIsValidPrivateKey}
              handleSafetyPhrase={handleSafetyPhrase}
              handleSetIsLoading={handleSetIsLoading}
              verifiedSafetyPhrase={verifiedSafetyPhrase}
              handleVerifiedSafetyPhrase={handleVerifiedSafetyPhrase}
              handleEnter={handleEnter}
            />
          )
        ) : (
          <SafetyPharase
            handleEnter={handleEnter}
            handleSafetyPhrase={handleSafetyPhrase}
            handleSetIsLoading={handleSetIsLoading}
            verifiedSafetyPhrase={verifiedSafetyPhrase}
            handleVerifiedSafetyPhrase={handleVerifiedSafetyPhrase}
          />
        )}
      </div>
    </>
  );
}
