import database from '../database';
import { AllReturn, DEFAULT_TYPE } from '../types';

interface GetPrivateKeyData {
  email: string;
}

export async function getPrivateKey({ email }: GetPrivateKeyData): AllReturn {
  return database.all(
    `SELECT * FROM private_keys WHERE email = '${email}' AND type='${DEFAULT_TYPE}'`
  );
}
