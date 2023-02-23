/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import database from '../database';
import { versions } from './versions';

export async function getDatabaseVersion() {
  const version = await database.all(`SELECT * FROM database_version`);
  if (version.length === 0) {
    await database.run(
      'CREATE TABLE IF NOT EXISTS database_version (version TEXT)'
    );
    return undefined;
  }
  return version[0];
}

export async function insertVersion(version: string) {
  return database.run(
    `INSERT INTO database_version (version) VALUES ('${version}') `
  );
}

export async function updateVersion(version: string) {
  return database.run(`UPDATE database_version SET version = '${version}'`);
}

export async function updateDatabase(dbVersion: string) {
  const currentVersionNumber = Number(dbVersion.replaceAll('.', ''));
  const listToUpdate = versions
    .map((version) => {
      if (version.number > currentVersionNumber) {
        return version;
      }
      return undefined;
    })
    .filter((version) => version !== undefined);
  if (listToUpdate.length > 0) {
    listToUpdate.map(async (version) => {
      const updateDatase = require(`./versions/${version?.version}.ts`);
      await updateDatase.update();
    });
  }
}
