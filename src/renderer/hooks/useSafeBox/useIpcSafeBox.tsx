/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IDefaultApiResult } from 'renderer/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/safeBoxesContext/SafeBoxesContext';
import { ISafeBox } from 'renderer/contexts/safeBoxesContext/types';
import * as types from './types';

export function useIpcSafeBox() {
  const {
    updateSafeBoxes,
    changeCurrentSafeBox,
    currentSafeBox,
    changeSafeBoxIsOpen,
    changeCreateSafeBoxIsLoading,
    changeSafeBoxesIsLoading,
  } = useContext(SafeBoxesContext);

  useEffect(() => {
    window.electron.ipcRenderer.on('createSafeBox-response', (result) => {
      const myResult = result as IDefaultApiResult;
      switch (myResult.status) {
        case 200:
          if (myResult?.data?.status === 'ok') {
            updateSafeBoxes(window.electron.store.get('safebox'));
            changeCreateSafeBoxIsLoading(false);
            changeSafeBoxIsOpen(false);
            changeCurrentSafeBox(undefined);
            toast.success('Cofre criado.', {
              ...toastOptions,
              toastId: 'createSafeBoxSucess',
            });
          } else {
            toast.error('Erro ao criar cofre.', {
              ...toastOptions,
              toastId: 'createSafeBoxSucess',
            });
          }
          break;
        default:
          toast.error('Erro ao criar cofre.', {
            ...toastOptions,
            toastId: 'createSafeBoxSucess',
          });
          break;
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'updateSafeBox-response',
      (result: types.IChangeSafeBoxResponse) => {
        switch (result.status) {
          case 200:
            if (result?.data?.status === 'ok') {
              const safeboxes = window.electron.store.get(
                'safebox'
              ) as ISafeBox[];

              const filter = safeboxes.filter((safebox) => {
                return safebox._id === result.safeBoxId;
              });
              changeCreateSafeBoxIsLoading(false);
              changeSafeBoxIsOpen(true);
              updateSafeBoxes(safeboxes);
              changeCurrentSafeBox(filter[0]);
              toast.success('Cofre editado.', {
                ...toastOptions,
                toastId: 'editSucess',
              });
            } else {
              toast.error('Erro ao editar cofre.', {
                ...toastOptions,
                toastId: 'editErrorNok',
              });
              changeCreateSafeBoxIsLoading(false);
            }
            break;
          default:
            toast.error('Erro ao editar cofre.', {
              ...toastOptions,
              toastId: 'editError',
            });
            changeCreateSafeBoxIsLoading(false);
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('deleteSafeBox-response', (result) => {
      const myResult = result as types.IDeleteSafeBoxResponse;
      switch (myResult.status) {
        case 200:
          if (myResult.data?.status === 'ok') {
            updateSafeBoxes(window.electron.store.get('safebox'));
            changeSafeBoxIsOpen(false);
            toast.success('Cofre deletado.', {
              ...toastOptions,
              toastId: 'successDeleteSafeBox',
            });
          } else {
            toast.error('Erro ao deletar cofre.', {
              ...toastOptions,
              toastId: 'errorDeleteSafeBoxNok',
            });
          }
          break;

        default:
          toast.error('Erro ao deletar cofre.', {
            ...toastOptions,
            toastId: 'errorDeleteSafeBox',
          });
          break;
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.GET_SAFE_BOXES_RESPONSE, () => {
      changeSafeBoxesIsLoading(false);
      const getSafeBox = window.electron.store.get('safebox');
      if (getSafeBox !== undefined) {
        updateSafeBoxes(getSafeBox);
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
      (result: types.IGetAllSafeBoxResponse) => {
        if (result.safeBoxResponse) {
          updateSafeBoxes(window.electron.store.get('safebox'));
          if (currentSafeBox !== undefined) {
            const safeBoxes = window.electron.store.get(
              'safeBox'
            ) as ISafeBox[];
            const filter = safeBoxes.filter(
              (safebox) => safebox._id === currentSafeBox._id
            );
            changeCurrentSafeBox(filter[0]);
          }
        }
        changeSafeBoxesIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'getSafeBox-response',
      async (result: types.IGetSafeBoxResponse) => {
        changeCurrentSafeBox(result.safeBox);
        changeCreateSafeBoxIsLoading(false);
      }
    );
  }, []);
}
