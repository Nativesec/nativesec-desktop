import database from '../database';
import { DEFAULT_TYPE, RunReturn } from '../types';

interface CreatePublicKeyData {
  email: string;
  fullName: string;
  publicKey: string;
}

export async function createPublicKey({
  email,
  fullName,
  publicKey,
}: CreatePublicKeyData): RunReturn {
  return database.run(
    `INSERT INTO public_keys (
      email,
      full_name,
      public_key,
      type
    ) VALUES (
      '${email.toLowerCase()}',
      '${fullName}',
      '${publicKey}',
      '${DEFAULT_TYPE}'
    )`
  );
}
