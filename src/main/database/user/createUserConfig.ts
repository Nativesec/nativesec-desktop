import database from '../database';
import { RunReturn } from '../types';

interface CreateUserConfigData {
  userConfig: {
    email: string;
    theme: string;
    lastOrganizationId: string | null;
    savePrivateKey: 'true' | 'false';
    refreshTime: string;
  };
}

export async function createUserConfig({
  userConfig,
}: CreateUserConfigData): RunReturn {
  return database.run(
    `
      insert into user_config (
        email,
        theme,
        savePrivateKey,
        lastOrganizationId,
        refreshTime
      )
      values (
        '${userConfig.email.toLowerCase()}',
        '${userConfig.theme}',
        '${userConfig.lastOrganizationId}',
        '${userConfig.savePrivateKey}',
        '${userConfig.refreshTime}'
      )
    `
  );
}
