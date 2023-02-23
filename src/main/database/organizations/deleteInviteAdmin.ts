import database from '../database';
import { RunReturn } from '../types';

export interface DeleteInviteAdminProps {
  adminGuests: string;
  organizationId: string;
}

const deleteInviteAdmin = async ({
  adminGuests,
  organizationId,
}: DeleteInviteAdminProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      convidados_administradores = '${adminGuests}'
      WHERE _id = '${organizationId}'
    `
  );
};

export default deleteInviteAdmin;
