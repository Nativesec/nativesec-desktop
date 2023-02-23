import database from '../database';
import { RunReturn } from '../types';

export interface DeleteOrganizationProps {
  organizationId: string;
}

const deleteOrganization = async ({
  organizationId,
}: DeleteOrganizationProps): RunReturn => {
  return database.run(
    `DELETE FROM organizations WHERE _id = '${organizationId}'`
  );
};

export default deleteOrganization;
