/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import LottieControl from 'renderer/components/LottieControl';
import styles from './styles.module.sass';
import animationData from '../../../../../assets/animationsJson/loading-button.json';

interface ButtonLoadingProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

const ButtonLoading = ({
  type = 'button',
  text = '',
  isLoading = false,
  className = '',
  ...props
}: ButtonLoadingProps): JSX.Element => {
  return (
    <div className={styles.buttonLoading}>
      {isLoading ? (
        <div className={styles.loading}>
          <LottieControl animationData={animationData} loop play />
        </div>
      ) : (
        <button
          className={`${styles.button} ${className}`}
          type={type}
          {...props}
        >
          {text}
        </button>
      )}
    </div>
  );
};

export default ButtonLoading;
