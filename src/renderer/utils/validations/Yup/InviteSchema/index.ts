import * as Yup from 'yup';
import { IInviteParticipant } from './types';

const InviteParticipantSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email Invalido.')
    .required('Email não pode ficar em branco.'),
  safetyPhrase: Yup.string()
    .required('Frase de Segurança não pode ficar em branco.')
    .min(6, 'Frase Secreta Invalida.')
    .max(32, 'Frase Secreta Invalida'),
});

const InviteParticipantInitialValues: IInviteParticipant = {
  email: '',
  safetyPhrase: '',
};

export { InviteParticipantSchema, InviteParticipantInitialValues };
