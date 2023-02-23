import * as Yup from 'yup';

const LeaveOrganizationSchema = Yup.object().shape({
  organizationName: Yup.string().required(
    'Nome da Organização não pode ficar em branco.'
  ),
  safetyPhrase: Yup.string()
    .required('Frase Secreta não pode ficar em branco.')
    .min(6, 'Frase Secreta Invalida.')
    .max(32, 'Frase Secreta Invalida.'),
});

const LeaveOrganizationInitialValues = {
  organizationName: '',
  safetyPhrase: '',
};

export { LeaveOrganizationSchema, LeaveOrganizationInitialValues };
