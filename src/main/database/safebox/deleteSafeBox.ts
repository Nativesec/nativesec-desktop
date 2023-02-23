import database from '../database';
import { RunReturn } from '../types';

export interface DeleteSafeBoxProps {
  safeBoxId: string;
}

export async function deleteSafeBox({
  safeBoxId,
}: DeleteSafeBoxProps): RunReturn {
  return database.run(
    `
      DELETE FROM safebox
      WHERE _id = '${safeBoxId}'
    `
  );
}
