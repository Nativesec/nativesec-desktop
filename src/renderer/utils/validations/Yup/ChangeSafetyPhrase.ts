import * as Yup from 'yup';

const ChangeSafetyPhraseSchema = Yup.object().shape({
  safetyPhrase: Yup.string()
    .required('Frase secreta não pode ficar em branco.')
    .min(12, 'Frase secreta invalida.')
    .max(32, 'Frase secreta invalida.'),
  newSafetyPhrase: Yup.string()
    .required('Nova Frase secreta não pode ficar em branco.')
    .min(12, 'Frase secreta invalida.')
    .max(32, 'Frase secreta invalida.'),
  confirmNewSafetyPhrase: Yup.string()
    .required('Frase secreta não pode ficar em branco.')
    .min(12, 'Frase secreta invalida.')
    .max(32, 'Frase secreta invalida.')
    .oneOf(
      [Yup.ref('newSafetyPhrase'), null],
      'Os campos de frase de segurança e repetição de frase de segurança não conferem.'
    ),
});

const ChangeSafetyPhraseInitialValues = {
  safetyPhrase: '',
  newSafetyPhrase: '',
  confirmNewSafetyPhrase: '',
};

export { ChangeSafetyPhraseInitialValues, ChangeSafetyPhraseSchema };
