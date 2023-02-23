/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import { IconType } from 'react-icons';
import styles from './styles.module.sass';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  className?: string;
  Icon?: IconType;
}

const Button = ({
  type = 'button',
  text = '',
  className = '',
  Icon,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button className={`${styles.button} ${className}`} type={type} {...props}>
      {Icon !== undefined && <Icon />}
      {text}
    </button>
  );
};

export default Button;
