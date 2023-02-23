import * as Yup from 'yup';

const StepOneSchema = Yup.object().shape({});
const StepTwoSchema = Yup.object().shape({
  name: Yup.string().required('Nome não pode ficar em branco').max(52),
});
const StepThreeSchema = Yup.object().shape({
  description: Yup.string().max(512, 'Maximo de caracteres 512'),
  mainColor: Yup.string(),
  secondColor: Yup.string(),
  darkMode: Yup.string(),
  file: Yup.string(),
});
const StepFourSchema = Yup.object().shape({});

const FourSchema = Yup.object().shape({
  email: Yup.string().email().max(255),
  isAdmin: Yup.boolean(),
});

export {
  StepOneSchema,
  StepTwoSchema,
  StepThreeSchema,
  StepFourSchema,
  FourSchema,
};
