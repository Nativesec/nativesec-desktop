import database from '../database';
import { AllReturn, DEFAULT_TYPE } from '../types';

interface GetPublicKeyData {
  email: string;
}

export async function getPublicKey({ email }: GetPublicKeyData): AllReturn {
  return database.all(
    `SELECT * FROM public_keys WHERE email = '${email}' AND type='${DEFAULT_TYPE}'`
  );
}
