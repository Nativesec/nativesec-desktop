/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-shadow */
import sqlite3 from '@journeyapps/sqlcipher';
import database from './database';

import { DEFAULT_TYPE, ICreatePrivateKey } from './types';

interface IInit {
  db: sqlite3.Database;
  secret: string;
  event?: Electron.IpcMainEvent;
}

const Init = async ({ db, secret, event }: IInit) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA cipher_compatibility = 4');
      db.run(`PRAGMA key = '${secret}'`);
      db.run(`PRAGMA SQLITE_THREADSAFE=4`);
      db.run('SELECT count(*) FROM sqlite_master;', async (err) => {
        if (err) {
          console.log(err, ' Init error');
          return ['error'];
        }
        db.all(
          `select * from public_keys where email = '' and type='${DEFAULT_TYPE}'`,
          async (err, rows) => {
            if (err?.message === 'SQLITE_ERROR: no such table: public_keys') {
              database.CreateTables(db);
            }
          }
        );
        resolve(db);
      });
    });
    return db;
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const verifyPasswordDB = async ({ db, secret }: IInit) => {
  return new Promise((resolve, reject) => {
    return db.serialize(() => {
      db.run('PRAGMA cipher_compatibility = 4');
      db.run(`PRAGMA key = '${secret}'`);
      db.run('SELECT count(*) FROM sqlite_master;', async (err) => {
        if (err) {
          console.log(err, '  verifyPasswordDB Error ');
          reject(err);
        } else {
          resolve('create');
        }
      });
    });
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
};

export default {
  Init,
  verifyPasswordDB,
};
