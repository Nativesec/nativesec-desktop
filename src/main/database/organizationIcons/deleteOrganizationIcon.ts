import database from '../database';
import { RunReturn } from '../types';

export interface DeleteOrganizationIconProps {
  organizationId: string;
}

const deleteOrganizationIcon = async ({
  organizationId,
}: DeleteOrganizationIconProps): RunReturn => {
  return database.run(
    `
      DELETE FROM organizationsIcons
      WHERE _id = '${organizationId}'
    `
  );
};

export default deleteOrganizationIcon;
