import database from '../database';
import { RunReturn } from '../types';

export interface DeleteAdminProps {
  admins: string;
  organizationId: string;
}

const deleteAdmin = async ({
  admins,
  organizationId,
}: DeleteAdminProps): RunReturn => {
  return database.run(
    `
      UPDATE organizations SET
      administradores = '${admins}'
      WHERE _id = '${organizationId}'
      `
  );
};

export default deleteAdmin;
