/* eslint-disable react-hooks/exhaustive-deps */
import { IUserConfig } from 'main/ipc/user/types';
import { IInitialData } from 'main/types';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CreateWorkspace } from 'renderer/pages/CreateWorkspace';
import { Home } from 'renderer/pages/Home/index';
import { Invite } from 'renderer/pages/Invite';
import { Register } from 'renderer/pages/Register';
import { Workspace } from 'renderer/pages/Workspace';
import { UserSettings } from 'renderer/pages/UserSettings';
import NotifyAtualization from 'renderer/components/NotifyAtualization';

import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContextProvider } from 'renderer/contexts/safeBoxesContext/SafeBoxesContext';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { ILeaveResponse } from 'renderer/pages/Workspace/types';
import { useIpcOrganization } from 'renderer/hooks/useOrganization/useIpcOrganization';
import Login from '../pages/Login/index';
import { LayoutsWithSidebar } from './LayoutsWithSidebar';
import { ProtectedRoutes } from './ProtectedRoutes';

export function AppRoutes() {
  const userConfig = window.electron.store.get('userConfig') as IUserConfig;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateTime, setUpdateTime] = useState<boolean>(true);
  const [updateTimer, setUpdateTimer] = useState<number>(15000);
  const [refreshTime, setRefreshTime] = useState<number>(
    userConfig === undefined ? 30 : Number(userConfig.refreshTime)
  );
  const navigate = useNavigate();
  const [isOpenNotifyAtualization, setIsOpenNotifyAtualization] =
    useState<boolean>(false);
  const handleRefreshTime = (newTime: number) => {
    const getUserConfig = window.electron.store.get(
      'userConfig'
    ) as IUserConfig;
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.UPDATE_USER_CONFIG,
      data: {
        ...getUserConfig,
        refreshTime: newTime,
      },
    });
    setRefreshTime(newTime);
  };

  useIpcOrganization();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'leave-response',
      (result: ILeaveResponse) => {
        if (result.type === 'sessionExpired') {
          toast.info('Sessão expirada', {
            ...toastOptions,
            toastId: 'sessionExpiredd',
          });
        }
        window.electron.ipcRenderer.sendMessage('initialData', []);
        navigate('/');
      }
    );
  }, []);

  const handleSetIsLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleOpenNotifyAtualization = useCallback(() => {
    setIsOpenNotifyAtualization(true);
  }, []);

  const handleCloseNotifyAtualization = useCallback(() => {
    setIsOpenNotifyAtualization(false);
  }, []);

  const handleSetUpdateTimer = useCallback(() => {
    setUpdateTimer(1800000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdateTime(!updateTime);
    }, updateTimer);
    const { updateAvaliable } = window.electron.store.get(
      'initialData'
    ) as IInitialData;
    if (updateAvaliable === true) {
      handleOpenNotifyAtualization();
      setUpdateTimer(1800000);
    }
    return () => clearTimeout(timer);
  }, [handleOpenNotifyAtualization, updateTime, updateTimer]);

  return (
    <>
      <NotifyAtualization
        isOpen={isOpenNotifyAtualization}
        handleSetUpdateTimer={handleSetUpdateTimer}
        onRequestClose={handleCloseNotifyAtualization}
      />
      <Routes>
        <Route
          path="/"
          element={<Login handleSetIsLoading={handleSetIsLoading} />}
        />
        <Route
          path="/register"
          element={<Register handleSetIsLoading={handleSetIsLoading} />}
        />
        <Route
          path="/home"
          element={
            <Home
              isLoading={isLoading}
              handleRefreshTime={handleRefreshTime}
              handleSetIsLoading={handleSetIsLoading}
            />
          }
        />
        <Route
          element={<ProtectedRoutes handleSetIsLoading={handleSetIsLoading} />}
        >
          <Route element={<LayoutsWithSidebar isLoading={isLoading} />}>
            <Route
              path="/workspace/:id"
              element={
                <SafeBoxesContextProvider>
                  <Workspace
                    refreshTime={refreshTime}
                    handleSetIsLoading={handleSetIsLoading}
                  />
                </SafeBoxesContextProvider>
              }
            />
            <Route
              path="/usersSettings"
              element={
                <UserSettings
                  refreshTime={refreshTime}
                  handleRefreshTime={handleRefreshTime}
                />
              }
            />
            <Route path="/invites" element={<Invite />} />
            <Route
              path="/createWorkspace"
              element={
                <CreateWorkspace handleSetIsLoading={handleSetIsLoading} />
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
