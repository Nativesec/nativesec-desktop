import database from '../database';
import { RunReturn } from '../types';

interface UpdateUserConfigData {
  userConfig: any;
  myEmail: string;
}

export async function updateUserConfig({
  userConfig,
  myEmail,
}: UpdateUserConfigData): RunReturn {
  return database.run(
    `
      UPDATE user_config SET
      lastOrganizationId = '${userConfig.lastOrganizationId}',
      refreshTime = '${userConfig.refreshTime}',
      theme = '${userConfig.theme}',
      savePrivateKey = '${userConfig.savePrivateKey}'
      WHERE email = '${myEmail}'
    `
  );
}
