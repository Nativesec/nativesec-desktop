/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import Lottie from 'react-lottie-player';

interface LottieControlProps {
  animationData: any;
  width?: number;
  height?: number;
  play?: true | false;
  loop?: true | false;
}

const LottieControl = ({
  width,
  height,
  ...props
}: LottieControlProps): JSX.Element => {
  return (
    <Lottie style={{ height: `${height}px`, width: `${width}px` }} {...props} />
  );
};

export default LottieControl;
