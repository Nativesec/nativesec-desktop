/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import styles from './styles.module.sass';

interface TextAreaProps {
  placeholder?: string;
  autoComplete?: string;
  isValid?: boolean;
  style?: React.CSSProperties | undefined;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  name?: string;
  value?: string;
  disabled?: boolean;
  onBlur?: {
    (e: React.FocusEvent): void;
    <T>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  theme?: 'light' | 'dark' | '';
}

const TextArea = ({
  isValid,
  placeholder,
  theme,
  ...props
}: TextAreaProps): JSX.Element => {
  return (
    <div
      className={`${styles.textAreaAnimated} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <textarea
        className={`${styles.input} ${isValid === false && styles.notValid}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default TextArea;
