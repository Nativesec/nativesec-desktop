/* eslint-disable import/no-mutable-exports */
import sqlite3 from '@journeyapps/sqlcipher';
import { store } from '../../main';
import database from '../../database/database';
import DB from '../../database';
import { migration } from '../../database/migrations';
import { IInitialData, IUser } from '../../types';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { UseIPCData } from '..';

export let myDatabase: sqlite3.Database;

export async function updateDatabase() {
  await migration();
  return {
    response: IPCTypes.UPDATE_DATABASE_RESPONSE,
  };
}

export async function initializeDB(arg: UseIPCData) {
  let response = IPCTypes.INITIALIZEDB_RESPONSE;
  if (arg.data?.type === 'register') {
    response = IPCTypes.INITIALIZEDB_RESPONSE_REGISTER;
  } else if (arg.data?.type === 'insertPrivateKey') {
    response = IPCTypes.INITIALIZEDB_INSERTED_PRIVATE_KEY_RESPONSE;
  }
  try {
    const { myEmail, safetyPhrase } = store.get('user') as IUser;
    const { PATH } = store.get('initialData') as IInitialData;
    await database.CreatePATH(PATH);
    const db = await database.CreateDatabase({ myEmail, PATH });
    await DB.Init({ db, secret: safetyPhrase });
    myDatabase = db;
    return {
      response,
      data: {
        status: 200,
      },
    };
  } catch (err) {
    return {
      response,
      data: {
        status: 400,
      },
    };
  }
}
