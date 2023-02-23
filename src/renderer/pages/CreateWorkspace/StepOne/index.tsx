import LottieControl from 'renderer/components/LottieControl';
import animationData from '../../../../../assets/animationsJson/create-workspace.json';
import { IStepOneProps } from '../types';

import styles from './styles.module.sass';

const StepOne = ({ currentTheme }: IStepOneProps): JSX.Element => {
  return (
    <div
      className={`${styles.stepOne} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.stepOne_svg}>
        <LottieControl animationData={animationData} play loop={false} />
      </div>
      <h4>
        Crie sua organização para reunir pessoas.
      </h4>
      <p>
        Mantenha suas senhas, segredos confidenciais protegidos. O Nativesec
        possibilita que você crie organizações ilimitadas. Você pode convidar
        quantas pessoas quiser para a sua organização! Uma organização pode ser
        uma ser uma empresa, uma equipe ou grupo de amigos, por exemplo.
      </p>
    </div>
  );
};

export default StepOne;
