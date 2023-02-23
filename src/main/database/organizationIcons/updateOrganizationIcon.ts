import database from '../database';
import { RunReturn } from '../types';

export interface UpdateOrganizationIconProps {
  icon: string;
  organizationId: string;
}

const updateOrganizationIcon = async ({
  icon,
  organizationId,
}: UpdateOrganizationIconProps): RunReturn => {
  return database.run(
    `
      UPDATE organizationsIcons SET
      icone = '${icon}'
      WHERE _id = '${organizationId}'
    `
  );
};

export default updateOrganizationIcon;
