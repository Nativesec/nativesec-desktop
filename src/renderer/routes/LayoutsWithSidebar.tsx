import { Outlet } from 'react-router-dom';
import { Sidebar } from 'renderer/components/Sidebar';

import styles from './styles.module.sass';

interface LayoutsWithSidebarProps {
  isLoading: boolean;
}
export function LayoutsWithSidebar({ isLoading }: LayoutsWithSidebarProps) {
  return (
    <>
      <div className={styles.flex_app}>
        <Sidebar isLoading={isLoading} />
        <Outlet />
      </div>
    </>
  );
}
