/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { BsExclamation } from 'react-icons/bs';

import { WorkspaceIconProps } from '../types';

import styles from './styles.module.sass';

const WorkspacesIcon = ({
  icon,
  workspaceName,
  onClick,
  className,
  type,
}: WorkspaceIconProps) => {
  return (
    <div className={styles.workspaceIcons} data-tooltip={type === 'invite' ? 'Convites Pendentes' : workspaceName}>
      <div
        className={`${styles.workspaceIcons_icon} ${className} ${type === 'invite' && styles.invite}`}
        onClick={onClick}
      >
        {icon === null || icon === '' || icon === 'null' ? (
          type === 'invite' ? (
            <BsExclamation />
          ) : (
            <p>{workspaceName?.split('')[0]}</p>
          )
          ): (
          <img src={icon} alt={workspaceName} />
        )}
      </div>
    </div>
  );
};

export default WorkspacesIcon;
