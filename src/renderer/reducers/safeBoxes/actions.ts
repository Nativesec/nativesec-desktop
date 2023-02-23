import { ISafeBox } from 'renderer/contexts/safeBoxesContext/types';

export enum ActionType {
  UPDATE_SAFEBOXES = 'CHANGE_SAFEBOXES',
  CHANGE_CURRENT_SAFE_BOX = 'CHANGE_CURRENT_SAFE_BOX',
  CHANGE_CREATE_SAFE_BOX_IS_LOADING = 'CHANGE_CREATE_SAFE_BOX_IS_LOADING',
  CHANGE_SAFE_BOX_IS_OPEN = 'CHANGE_SAFE_BOX_IS_OPEN',
  CHANGE_SAFE_BOXES_IS_LOADING = 'CHANGE_SAFE_BOXES_IS_LOADING',
}

export function updateSafeBoxesAction(safeBoxes: ISafeBox[]) {
  return {
    type: ActionType.UPDATE_SAFEBOXES,
    payload: {
      safeBoxes,
    },
  };
}

export function changeCurrentSafeBoxAction(
  newCurrentSafeBox: ISafeBox | undefined
) {
  return {
    type: ActionType.CHANGE_CURRENT_SAFE_BOX,
    payload: {
      newCurrentSafeBox,
    },
  };
}

export function changeCreateSafeBoxIsLoadingAction(isLoading: boolean) {
  return {
    type: ActionType.CHANGE_CREATE_SAFE_BOX_IS_LOADING,
    payload: {
      isLoading,
    },
  };
}

export function changeSafeBoxIsOpenAction(isOpen: boolean){
  return {
    type: ActionType.CHANGE_SAFE_BOX_IS_OPEN,
    payload: {
      isOpen,
    },
  };
}

export function changeSafeBoxesIsLoadingAction(isLoading: boolean){
  return {
    type: ActionType.CHANGE_SAFE_BOXES_IS_LOADING,
    payload: {
      isLoading,
    },
  };
}
