/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */

import styles from './styles.module.sass';

interface ToggleSwitchProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  name?: string;
  value?: string;
  checked?: boolean;
}
const ToggleSwitch = ({ ...props }: ToggleSwitchProps): JSX.Element => {
  return (
    <div className={styles.ToggleSwitch}>
      <label className={styles.switch}>
        <input type="checkbox" {...props} />
        <span className={`${styles.slider} ${styles.round}`} />
      </label>
    </div>
  );
};

export default ToggleSwitch;
