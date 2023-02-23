import database from '../database';
import { RunReturn } from '../types';

export interface InviteParticipantProps {
  participantGuests: string;
  organizationId: string;
}

const inviteParticipant = async ({
  organizationId,
  participantGuests,
}: InviteParticipantProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      convidados_participantes = '${participantGuests}'
      WHERE _id = '${organizationId}'
    `
  );
};

export default inviteParticipant;
