import { IOrganizationDatabase } from 'renderer/routes/types';
import { myDatabase } from '../../ipc/database';
import database from '../database';
import { IIconsDatabase } from '../../ipc/organizations/types';

export async function listOrganizationsIcons(
  orgs: IOrganizationDatabase[]
): Promise<IIconsDatabase[]> {
  const icons = await new Promise((resolve, reject) => {
    myDatabase.all(`SELECT * FROM organizationsIcons`, (error, rows) => {
      if (error) {
        console.log(error, ' DATABASE select organizationsICONS');
        reject(error);
      }

      resolve(rows);
    });
  });

  return icons as unknown as IIconsDatabase[];
}
