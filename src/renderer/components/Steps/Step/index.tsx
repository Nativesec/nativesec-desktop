/* eslint-disable react/require-default-props */
import { BiCheck } from 'react-icons/bi';
import styles from './styles.module.sass';

interface IStepProps {
  steps: {
    number: number;
    text: string;
  }[];
  step?: number;
}
const Step = ({ step = -1, steps = [] }: IStepProps): JSX.Element => {
  return (
    <div className={styles.step}>
      {steps.map((index) => (
        <div key={index.number}>
          <span className={step >= index.number ? styles.selected : ''}>
            {step > index.number ? <BiCheck /> : index.number}
          </span>
          <h5>{index.text}</h5>
        </div>
      ))}
    </div>
  );
};

export default Step;
