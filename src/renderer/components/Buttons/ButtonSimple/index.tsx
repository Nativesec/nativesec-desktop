/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import styles from './styles.module.sass';

interface ButtonSimpleProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonSimple = ({
  text = '',
  className,
  type = 'submit',
  ...props
}: ButtonSimpleProps): JSX.Element => {
  return (
    <button type={type} className={`${styles.button} ${className}`} {...props}>
      {text}
    </button>
  );
};

export default ButtonSimple;
