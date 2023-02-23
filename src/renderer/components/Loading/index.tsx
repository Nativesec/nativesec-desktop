import LottieControl from '../LottieControl';
import styles from './styles.module.sass';
import animationData from '../../../../assets/animationsJson/airplane.json';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <LottieControl animationData={animationData} loop play />
      <p>Carregando...</p>
    </div>
  );
};

export default Loading;
