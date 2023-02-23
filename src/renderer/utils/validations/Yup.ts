import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Nome não pode ficar em branco.').max(120),
  email: Yup.string()
    .email('Email Invalido.')
    .required('Email não pode ficar em branco.')
    .max(255),
  safetyPhrase: Yup.string()
    .required('Frase de Segurança não pode ficar em branco.')
    .min(12, 'Frase de Segurança deve ter pelomenos 12 caracteres.')
    .max(32),
  confirmSafetyPhrase: Yup.string()
    .required('Confirme a Frase de Segurança.')
    .max(32)
    .oneOf(
      [Yup.ref('safetyPhrase'), null],
      'Os campos de frase de segurança e repetição de frase de segurança não conferem.'
    ),
  savePrivateKey: Yup.string(),
});

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email Invalido.')
    .required('Email não pode ficar em branco.')
    .max(255),
});
const safetySchema = Yup.object().shape({
  safetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Invalida.')
    .max(32),
});
const validationTokenEmail = Yup.object().shape({
  token: Yup.string().required('Token não pode ficar em branco.').max(255),
});

const StepOne = Yup.object().shape({
  token: Yup.string()
    .email()
    .required('Email não pode ficar em branco.')
    .max(255),
});

export {
  registerSchema,
  loginSchema,
  validationTokenEmail,
  safetySchema,
  StepOne,
};
