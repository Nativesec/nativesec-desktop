/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import {
  getDatabaseVersion,
  insertVersion,
  updateDatabase,
  updateVersion,
} from './config';

const { version } = require('../../../../package.json');

export async function migration() {
  const dbversion = await getDatabaseVersion();
  if (dbversion === undefined) {
    await insertVersion(version);
    await updateDatabase(version);
  } else if (dbversion !== null) {
    if (dbversion.version !== version) {
      await updateVersion(version);
      await updateDatabase(dbversion.version);
    }
  }
}
