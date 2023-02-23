import { ISafeBoxDatabase } from 'renderer/pages/Workspace/types';
import database from '../database';

export interface GetSafeBoxProps {
  safeBoxId: string;
  organizationId: string;
}

const getSafeBox = async ({
  safeBoxId,
  organizationId,
}: GetSafeBoxProps): Promise<ISafeBoxDatabase> => {
  const select = await database.all(
    `
      SELECT * FROM safebox
      WHERE _id = '${safeBoxId}'
      AND organizacao = '${organizationId}'
    `
  );
  return select[0] as unknown as ISafeBoxDatabase;
};

export default getSafeBox;
