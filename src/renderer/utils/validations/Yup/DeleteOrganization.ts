import * as Yup from 'yup';

const DeleteOrganizationSchema = Yup.object().shape({
  organizationName: Yup.string().required(
    'Nome da Organização não pode ficar em branco'
  ),
  safetyPhrase: Yup.string()
    .required('Frase Secreta não pode ficar em branco.')
    .min(6, 'Frase Secreta invalida.'),
});

const DeleteOrganizationInitialValues = {
  organizationName: '',
  safetyPhrase: '',
};

export { DeleteOrganizationSchema, DeleteOrganizationInitialValues };
