/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import styles from './styles.module.sass';

interface ICheckboxProps {
  value?: boolean;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  text?: string;
}
const Checkbox = ({ value, text, ...props }: ICheckboxProps) => {
  return (
    <div className={styles.checkbox}>
      <input type="checkbox" value={String(value)} {...props} />
      <p>{text}</p>
    </div>
  );
};

export default Checkbox;
