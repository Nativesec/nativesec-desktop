import database from '../database';
import { RunReturn } from '../types';

export interface DeleteInviteParticipantProps {
  participantGuests: string;
  organizationId: string;
}

const deleteInviteParticipant = async ({
  participantGuests,
  organizationId,
}: DeleteInviteParticipantProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      convidados_participantes = '${participantGuests}'
      WHERE _id = '${organizationId}'
      `
  );
};

export default deleteInviteParticipant;
