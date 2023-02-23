/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import { IconType } from 'react-icons/lib';
import { string } from 'yup/lib/locale';
import styles from './styles.module.sass';

interface ButtonOutlinedProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  className?: string;
  Icon?: IconType;
  datatooltip?: string;
  disabled?: boolean;
}

const ButtonOutlined = ({
  type = 'button',
  text = '',
  Icon,
  className = '',
  datatooltip = '',
  disabled,
  onClick,
}: ButtonOutlinedProps): JSX.Element => {
  return (
    <button
      className={`${styles.button} ${className} ${disabled && styles.disabled}`}
      type={type}
      onClick={disabled ? undefined : onClick}
      data-tooltip={datatooltip}
    >
      {Icon !== undefined && <Icon />}
      {text}
    </button>
  );
};

export default ButtonOutlined;
