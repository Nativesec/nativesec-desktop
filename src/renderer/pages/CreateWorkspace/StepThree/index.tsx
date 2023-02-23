import TextAreaAnimated from 'renderer/components/TextArea/TextAreaAnimated';
import ColorPicker from 'react-best-gradient-color-picker';

import rgbaToHex from 'renderer/utils/rgbatohex';

import { IStepProps } from '../types';

import styles from './styles.module.sass';

const StepThree = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  currentTheme,
}: IStepProps): JSX.Element => {
  return (
    <div
      className={`${styles.stepThree} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <TextAreaAnimated
        text="Descrição sobre a organização"
        style={{ height: 135 }}
        onChange={handleChange}
        name="description"
        value={values.description}
        onBlur={handleBlur}
      />
      <div className={styles.pickColor}>
        <div>
          <p>Cor Primaria</p>
          <ColorPicker
            width={150}
            height={150}
            onChange={(e: string) =>
              setFieldValue && setFieldValue('mainColor', rgbaToHex(e))
            }
            value={values.mainColor}
            name="mainColor"
            hidePresets
            hideControls
            hideInputs
          />
        </div>
        <div>
          <p>Cor Secundaria</p>
          <ColorPicker
            width={150}
            height={150}
            onChange={(e: string) =>
              setFieldValue && setFieldValue('secondColor', rgbaToHex(e))
            }
            value={values.secondColor}
            name="secondColor"
            hidePresets
            hideControls
            hideInputs
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
