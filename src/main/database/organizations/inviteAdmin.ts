import database from '../database';
import { RunReturn } from '../types';

export interface InviteParticipantProps {
  adminsGuests: string;
  organizationId: string;
}

const inviteAdmin = async ({
  organizationId,
  adminsGuests,
}: InviteParticipantProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      convidados_administradores = '${adminsGuests}'
      WHERE _id = '${organizationId}'
    `
  );
};

export default inviteAdmin;
