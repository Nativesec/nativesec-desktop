import database from '../database';
import { DEFAULT_TYPE } from '../types';

interface CreatePrivateKey {
  email: string;
  fullName: string;
  privateKey: string;
}

export async function createPrivateKey({
  email,
  fullName,
  privateKey,
}: CreatePrivateKey) {
  return database.run(
    `INSERT INTO private_keys (
      email,
      full_name,
      private_key,
      type
      ) VALUES (
        '${email.toLowerCase()}',
        '${fullName}',
        '${privateKey}',
        '${DEFAULT_TYPE}'
      )`
  );
}
