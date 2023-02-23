/* eslint-disable no-nested-ternary,eqeqeq */
import { ISafeBoxDatabase } from '../../ipc/organizations/types';
import database from '../database';

export interface GetAllSafeBoxProps {
  organizationId: string;
}

export async function listSafeBox({
  organizationId,
}: GetAllSafeBoxProps): Promise<ISafeBoxDatabase[]> {
  const select = await database.all(
    `SELECT * FROM safebox WHERE organizacao = '${organizationId}'`
  );

  const sort = select.sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  return sort as ISafeBoxDatabase[];
}
