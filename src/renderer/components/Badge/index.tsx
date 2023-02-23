/* eslint-disable react/button-has-type */
import { AiOutlineCloseCircle } from 'react-icons/ai';

import styles from './styles.module.sass';

interface IBadgeProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
const Badge = ({ text, onClick }: IBadgeProps): JSX.Element => {
  return (
    <div className={styles.badge}>
      {text}
      <button onClick={onClick} type="button">
        <AiOutlineCloseCircle />
      </button>
    </div>
  );
};

export default Badge;
