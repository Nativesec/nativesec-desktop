import { AppRoutes } from 'renderer/routes';
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
import { OrganizationsContextProvider } from './contexts/organizationsContext/OrganizationsContext';
import { ThemeContextProvider } from './contexts/theme/ThemeContext';
import { ModalContextProvider } from './contexts/modal/ModalContext';

export default function App() {
  return (
    <>
      <HashRouter>
        <OrganizationsContextProvider>
          <ThemeContextProvider>
            <ModalContextProvider>
              <AppRoutes />
            </ModalContextProvider>
          </ThemeContextProvider>
        </OrganizationsContextProvider>
      </HashRouter>
      <ToastContainer />
    </>
  );
}
