import { createContext, ReactNode, useReducer } from 'react';
import {
  changeCreateSafeBoxIsLoadingAction,
  changeCurrentSafeBoxAction,
  changeSafeBoxesIsLoadingAction,
  changeSafeBoxIsOpenAction,
  updateSafeBoxesAction,
} from 'renderer/reducers/safeBoxes/actions';
import { safeBoxesReducer } from 'renderer/reducers/safeBoxes/reducer';
import { ISafeBox } from './types';

interface SafeBoxesContextType {
  safeBoxes: ISafeBox[];
  currentSafeBox: ISafeBox | undefined;
  safeBoxesIsLoading: boolean;
  safeBoxIsOpen: boolean;
  createSafeBoxIsLoading: boolean;
  changeCreateSafeBoxIsLoading: (isLoading: boolean) => void;
  changeSafeBoxIsOpen: (isOpen: boolean) => void;
  changeSafeBoxesIsLoading: (isLoading: boolean) => void;
  changeCurrentSafeBox: (newCurrentSafeBox: ISafeBox | undefined) => void;
  updateSafeBoxes: (newSafeBoxes: ISafeBox[]) => void;
}
export const SafeBoxesContext = createContext({} as SafeBoxesContextType);

interface SafeBoxesContextProviderProps {
  children: ReactNode;
}

export function SafeBoxesContextProvider({
  children,
}: SafeBoxesContextProviderProps) {
  const [safeBoxesState, dispatch] = useReducer(safeBoxesReducer, {
    safeBoxes: [],
    currentSafeBox: undefined,
    safeBoxesIsLoading: false,
    safeBoxIsOpen: false,
    createSafeBoxIsLoading: false,
  });

  const {
    safeBoxes,
    currentSafeBox,
    safeBoxesIsLoading,
    safeBoxIsOpen,
    createSafeBoxIsLoading,
  } = safeBoxesState;

  function changeCreateSafeBoxIsLoading(isLoading: boolean) {
    dispatch(changeCreateSafeBoxIsLoadingAction(isLoading));
  }

  function changeSafeBoxIsOpen(isOpen: boolean) {
    dispatch(changeSafeBoxIsOpenAction(isOpen));
  }

  function changeSafeBoxesIsLoading(isLoading: boolean) {
    dispatch(changeSafeBoxesIsLoadingAction(isLoading));
  }

  function updateSafeBoxes(newSafeBoxes: ISafeBox[]) {
    dispatch(updateSafeBoxesAction(newSafeBoxes));
  }

  function changeCurrentSafeBox(newCurrentSafeBox: ISafeBox | undefined) {
    dispatch(changeCurrentSafeBoxAction(newCurrentSafeBox));
  }

  return (
    <SafeBoxesContext.Provider
      value={{
        safeBoxes,
        currentSafeBox,
        updateSafeBoxes,
        safeBoxesIsLoading,
        safeBoxIsOpen,
        createSafeBoxIsLoading,
        changeCurrentSafeBox,
        changeSafeBoxesIsLoading,
        changeSafeBoxIsOpen,
        changeCreateSafeBoxIsLoading,
      }}
    >
      {children}
    </SafeBoxesContext.Provider>
  );
}
