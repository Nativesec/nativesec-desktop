/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonLoading from 'renderer/components/Buttons/ButtonLoading';
import ButtonSimple from 'renderer/components/Buttons/ButtonSimple';
import Step from 'renderer/components/Steps/Step';
import {
  StepFourSchema,
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema,
} from 'renderer/utils/validations/Yup/CreateWorkspace';
import { ThemeContext } from 'renderer/contexts/theme/ThemeContext';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import StepFour from './StepFour';
import StepOne from './StepOne';
import StepThree from './StepThree';
import { StepTwo } from './StepTwo';
import { ICreateWorkspaceProps, IUsers } from './types';

import styles from './styles.module.sass';

const steps = [
  {
    number: 1,
    text: 'Bem Vindo',
  },
  {
    number: 2,
    text: 'Novo Workspace',
  },
  {
    number: 3,
    text: 'Informaçoes Adicionais',
  },
  {
    number: 4,
    text: 'Convidar Membros',
  },
];

export function CreateWorkspace({ handleSetIsLoading }: ICreateWorkspaceProps) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [step, setStep] = useState<number>(1);
  const [users, setUsers] = useState<IUsers[]>([]);
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const handleNextStep = () => {
    const next = step === 4 ? 1 : step + 1;
    setStep(next);
  };

  useEffect(() => {
    handleSetIsLoading(false);
  }, []);

  const onSubmit = (values: any) => {
    if (step !== 4) {
      handleNextStep();
    }
    if (step === 4) {
      setButtonIsLoading(true);
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.CREATE_ORGANIZATION,
        data: {
          name: values.name,
          theme: JSON.stringify({
            mainColor: values.mainColor,
            secondColor: values.secondColor,
          }),
          description: values.description,
          icon: values.icon === undefined ? 'null' : values.icon,
          adminGuests: users
            .filter((user) => user.isAdmin === true)
            .map((user) => user.email),
          participantGuests: users
            .filter((user) => user.isAdmin === false)
            .map((user) => user.email),
        },
      });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/home');
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div
      className={`${styles.createWorkspace} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.steps}>
        <Step steps={steps} step={step} />
      </div>

      <div className={styles.createWorkspace_content}>
        <Formik
          initialValues={{
            name: '',
            description: '',
            mainColor: '#000000',
            secondColor: '#000000',
            darkMode: false,
            icon: null,
          }}
          validationSchema={
            step === 1
              ? StepOneSchema
              : step === 2
              ? StepTwoSchema
              : step === 3
              ? StepThreeSchema
              : StepFourSchema
          }
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            touched,
            setFieldValue,
          }) => (
            <Form>
              <>
                {step === 1 ? (
                  <StepOne currentTheme={theme} />
                ) : step === 2 ? (
                  <StepTwo
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    currentTheme={theme}
                  />
                ) : step === 3 ? (
                  <StepThree
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    currentTheme={theme}
                  />
                ) : (
                  <StepFour
                    setUsers={setUsers}
                    users={users}
                    currentTheme={theme}
                  />
                )}
              </>
              <div
                className={`${styles.createWorkspace_buttons} ${
                  step === 1 ? styles.buttonFirstStep : ''
                }`}
              >
                <ButtonLoading
                  text={
                    step === 1
                      ? 'Vamos Criar nosso Workspace'
                      : step === 2 || step === 3
                      ? 'Proximo'
                      : step === 4
                      ? 'Criar Workspace'
                      : ''
                  }
                  type="submit"
                  className={styles.main_button}
                  isLoading={buttonIsLoading}
                />
                {step !== 1 && (
                  <ButtonSimple
                    text="Voltar"
                    type="button"
                    onClick={handleBack}
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
