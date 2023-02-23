import * as Yup from 'yup';

const ConfirmSafetyPhraseSchema = Yup.object().shape({
  safeBoxName: Yup.string(),
  safetyPhrase: Yup.string()
    .required('Frase Secreta não pode ficar em branco.')
    .min(6, 'Frase Secreta invalida.')
    .max(32, 'Frase Secreta invalida.'),
});

const ConfirmSafetyPhraseInitialValues = {
  safeBoxName: '',
  safetyPhrase: '',
};

export { ConfirmSafetyPhraseSchema, ConfirmSafetyPhraseInitialValues };
