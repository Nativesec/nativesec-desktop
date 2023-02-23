/* eslint-disable @typescript-eslint/no-shadow */
import fs from 'fs';
import path from 'path';
import sqlite3 from '@journeyapps/sqlcipher';
import md5 from 'md5';
import * as openpgp from 'openpgp';
import axios from 'axios';
import { myDatabase } from '../ipc/database';
import DB from './index';
import { IUserConfig } from '../ipc/user/types';
import tables, { ITables } from './tables';
import {
  AllReturn,
  DEFAULT_TYPE,
  IChangeSafetyPhrase,
  RunReturn,
} from './types';
import { IInitialData, IKeys, IToken, IUser } from '../types';
import { store } from '../main';
import { api } from '../util';

interface ICreateDatabase {
  myEmail: string;
  PATH: string;
  WORKSPACE?: string;
}
const CreateDatabase = async ({
  myEmail,
  PATH,
  WORKSPACE = 'default',
}: ICreateDatabase): Promise<sqlite3.Database> => {
  return new sqlite3.Database(
    `${PATH}/database/${WORKSPACE}/${md5(myEmail)}.sqlite3`,
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};
const CreatePATH = async (PATH: string, WORKSPACE = 'default') => {
  if (!fs.existsSync(path.join(PATH, 'database'))) {
    fs.mkdir(path.join(PATH, 'database'), async (err) => {
      if (err) {
        console.error(err, 'err2');
      }
      if (!fs.existsSync(path.join(PATH, 'database', WORKSPACE))) {
        fs.mkdir(path.join(PATH, 'database', WORKSPACE), async (err) => {
          if (err) {
            console.error(err, 'err2');
          }
        });
      }
    });
  } else if (!fs.existsSync(path.join(PATH, 'database', WORKSPACE))) {
    fs.mkdir(path.join(PATH, 'database', WORKSPACE), (err) => {
      if (err) {
        console.error(err, 'err1');
      }
    });
  }
};

const CreateTables = async (db: sqlite3.Database) => {
  tables.forEach(async (table: ITables) => {
    await new Promise((resolve, reject) => {
      db.run(table.query, async (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(table.name);
        }
      });
    });
  });
};

const ChangeSafetyPhrase = async ({
  newSafetyPhrase,
  db,
}: IChangeSafetyPhrase) => {
  try {
    const { myEmail, myFullName, safetyPhrase } = store.get('user') as IUser;
    const { privateKey } = store.get('keys') as IKeys;
    const { tokenType, accessToken } = store.get('token') as IToken;
    const privateKeyDecrypt = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
      passphrase: safetyPhrase,
    });

    const newKey = await openpgp.reformatKey({
      privateKey: privateKeyDecrypt,
      userIDs: [{ email: myEmail.toLowerCase(), name: myFullName }],
      passphrase: newSafetyPhrase,
    });

    const userConfig = store.get('userConfig') as IUserConfig;
    if (Boolean(userConfig.savePrivateKey) === true) {
      const result = await axios
        .delete(`${api}/privatekey/`, {
          data: {
            chave: privateKey,
            tipo: 'rsa',
          },
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        })
        .then(async (result) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
      if (result === true) {
        axios
          .post(
            `${api}/privatekey/`,
            {
              chave: newKey.privateKey,
              tipo: DEFAULT_TYPE,
            },
            {
              headers: {
                Authorization: `${tokenType} ${accessToken}`,
              },
            }
          )
          .catch((err) => {
            console.log(err, ' ERROR APIPrivateKeyError');
            throw new Error('APIPrivateKeyError');
          });
      }
    }
    store.set('keys', {
      ...(store.get('keys') as IKeys),
      privateKey: newKey.privateKey,
    });

    db.all(
      `UPDATE private_keys SET private_key ='${newKey.privateKey}' WHERE email = '${myEmail}'`
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const all = async (query: string): AllReturn => {
  const { myEmail, safetyPhrase } = store.get('user') as IUser;
  const { PATH } = store.get('initialData') as IInitialData;
  const db = await CreateDatabase({ myEmail, PATH });
  await DB.Init({ db, secret: safetyPhrase });

  const all = await new Promise((resolve, reject) => {
    db.all(query, async (error, rows) => {
      if (error) {
        console.log(error, ' Erro all DATABASE');
        reject(error);
      }
      resolve(rows);
    });
  })
    .then((result) => {
      return result as AllReturn;
    })
    .catch((error) => {
      console.log(error, ' ERROR DB ALL');
      return [];
    });

  return all;
};

const get = async (query: string): Promise<unknown> => {
  const { myEmail, safetyPhrase } = store.get('user') as IUser;
  const { PATH } = store.get('initialData') as IInitialData;
  const db = await CreateDatabase({ myEmail, PATH });
  await DB.Init({ db, secret: safetyPhrase });
  const stmt = db.prepare(query);
  const get = await new Promise((resolve, reject) => {
    stmt.get((error, row) => {
      if (error) {
        console.log(error, ' ERROR GET DATABASE');
        reject(error);
      }
      resolve(row);
    });
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error, ' ERRO GET DATABASE');
      return [];
    });
  stmt.finalize();
  db.close();
  return get;
};

const run = async (query: string): RunReturn => {
  const run = new Promise((resolve, reject) => {
    myDatabase.run(query, (err) => {
      if (err) {
        console.log(err, 'ERROR RUN DATABASE');
        reject(err);
      }
      resolve(true);
    });
  })
    .then((result) => {
      return true;
    })
    .catch((error) => {
      console.log(error, 'RUN DB ERROR');
      return false;
    });
  return run;
};

export default {
  CreateDatabase,
  CreatePATH,
  CreateTables,
  ChangeSafetyPhrase,
  all,
  run,
  get,
};
