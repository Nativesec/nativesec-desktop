import database from '../database';
import { AllReturn } from '../types';

interface GetUserConfigProps {
  email: string;
}

export async function getUserConfig({ email }: GetUserConfigProps): AllReturn {
  return database.all(`SELECT * FROM user_config WHERE email = '${email}'`);
}
