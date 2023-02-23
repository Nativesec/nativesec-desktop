import { IOrganizationDatabase } from 'renderer/routes/types';
import database from '../database';

const listOrganizations = async (): Promise<IOrganizationDatabase[]> => {
  const select = await database.all(`SELECT * FROM organizations`);
  const sort = select.sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  return sort as IOrganizationDatabase[];
};

export default listOrganizations;
