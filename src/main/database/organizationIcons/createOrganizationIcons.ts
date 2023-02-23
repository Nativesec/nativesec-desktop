import database from '../database';
import { RunReturn } from '../types';

export interface CreateOrganizationData {
  _id: string;
  icon: string;
}

export async function createOrganizationIcon({
  _id,
  icon,
}: CreateOrganizationData): RunReturn {
  return database.run(
    `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${_id}','${icon}')`
  );
}

export default createOrganizationIcon;
