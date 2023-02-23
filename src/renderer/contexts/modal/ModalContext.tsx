import { createContext, ReactNode, useState } from 'react';

interface ThemeContextType {
  isCloseModal: boolean;
  changeModal: (change: boolean) => void;
}

export const ModalContext = createContext({} as ThemeContextType);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export function ModalContextProvider({ children }: ThemeContextProviderProps) {
  const [isCloseModal, setIsCloseModal] = useState<boolean>(false);

  function changeModal(change: boolean) {
    setIsCloseModal(change);
  }

  return (
    <ModalContext.Provider value={{ isCloseModal, changeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
