/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import styles from './styles.module.sass';

interface InputProps {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  isValid?: boolean;
  style?: React.CSSProperties | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name?: string;
  value?: string;
  className?: string;
  readOnly?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  onBlur?: {
    (e: React.FocusEvent): void;
    <T>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  theme?: 'dark' | 'light' | '';
}

const Input = ({
  isValid,
  type,
  placeholder,
  className,
  readOnly = false,
  theme,
  ...props
}: InputProps): JSX.Element => {
  return (
    <div
      className={`${styles.inputAnimated} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <input
        className={`${styles.input} ${
          isValid === false && styles.notValid
        } ${className}`}
        readOnly={readOnly}
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;
