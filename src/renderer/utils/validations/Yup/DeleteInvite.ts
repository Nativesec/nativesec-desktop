import * as Yup from 'yup';
import { IDeleteInvite } from './DeleteTypes';

const DeleteInviteSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email Invalido.')
    .required('Email não pode ficar em branco.'),
  safetyPhrase: Yup.string().required(
    'Frase de Segurança não pode ficar em branco.'
  ),
});

const DeleteInviteInitialValues: IDeleteInvite = {
  email: '',
  safetyPhrase: '',
};

export { DeleteInviteSchema, DeleteInviteInitialValues };
