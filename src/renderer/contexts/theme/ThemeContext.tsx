import { createContext, ReactNode, useReducer } from 'react';
import { changeThemeAction } from 'renderer/reducers/theme/actions';
import { themeReducer } from 'renderer/reducers/theme/reducer';
import { ThemeType } from './types';

interface ThemeContextType {
  theme: ThemeType;
  changeTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [themeState, dispatch] = useReducer(themeReducer, {
    theme: 'light',
  });

  const { theme } = themeState;

  function changeTheme(newTheme: ThemeType) {
    dispatch(changeThemeAction(newTheme));
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
