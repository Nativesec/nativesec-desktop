import { Outlet } from 'react-router-dom';
import Login from 'renderer/pages/Login';

interface ProtectedRoutesProps {
  handleSetIsLoading: (loading: boolean) => void;
}

export function ProtectedRoutes({ handleSetIsLoading }: ProtectedRoutesProps) {
  const user = window.electron.store.get('token');
  return user?.accessToken ? (
    <Outlet />
  ) : (
    <Login handleSetIsLoading={handleSetIsLoading} />
  );
}
