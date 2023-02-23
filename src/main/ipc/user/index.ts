/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import fs from 'fs';
import md5 from 'md5';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { store } from '../../main';
import { IInitialData, IToken, IUser, UseIPCData } from '../../types';
import { api } from '../../util';
import { ICreateUser, IUserConfig } from './types';
import DB from '../../database';
import database from '../../database/database';
import APIUser from '../../API/user';
import APIKey from '../../API/keys';
import DBUser from '../../database/user';

export async function authPassword(arg: UseIPCData) {
  let response = 'authPassword-response';
  if (arg.data.type === 'register') {
    response = IPCTypes.AUTH_PASSWORD_RESPONSE_REGISTER;
  }
  const result = await APIUser.authPassword({ email: arg.data.email }).catch(
    () => {
      return { status: 500, data: { status: '' } };
    }
  );
  if (result.status === 200 && result.data?.status === 'ok') {
    if (arg.data.type !== 'register') {
      store.set('user', {
        ...(store.get('user') as IUser),
        myEmail: arg.data.email,
      });
    }
  }
  return {
    response,
    data: {
      status: result?.status,
      data: result?.data,
    },
  };
}

export async function authLogin(arg: UseIPCData) {
  const { myEmail } = store.get('user') as IUser;
  const result = await APIUser.authLogin({
    email: myEmail,
    password: arg.data.token,
  });
  if (result.status === 200 && result.data?.status === 'ok') {
    store.set('token', {
      accessToken: result.data.msg.access_token,
      tokenType: result.data.msg.token_type,
    });
  }

  return {
    response: IPCTypes.AUTH_LOGIN_RESPONSE,
    data: {
      status: result.status,
      data: result.data,
    },
  };
}

export async function verifyDatabasePassword() {
  const { myEmail, safetyPhrase } = store.get('user') as IUser;
  const { PATH } = store.get('initialData') as IInitialData;
  if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
    const db = await database.CreateDatabase({ myEmail, PATH });
    const verify: any = await DB.verifyPasswordDB({ db, secret: safetyPhrase });
    if (verify.errno === 26) {
      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: {
          status: verify.errno,
          data: {
            data: 'nok',
          },
        },
      };
    }
    return {
      response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
      data: {
        status: 200,
        data: {
          status: 'ok',
        },
      },
    };
  }
  return {
    response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
    data: {
      status: 200,
      data: {
        status: 'nok',
      },
    },
  };
}

export async function setUserConfig() {
  const { accessToken, tokenType } = store.get('token') as IToken;
  const { myEmail } = store.get('user') as IUser;
  const userConfig = await DBUser.getUserConfig({
    email: myEmail,
  });

  if (userConfig.length === 0) {
    const apiGetPrivateKey = await APIKey.getPrivateKey({
      email: myEmail,
      authorization: `${tokenType} ${accessToken}`,
    });
    if (apiGetPrivateKey.data?.status === 'ok') {
      if (apiGetPrivateKey.data?.msg.length > 0) {
        store.set('userConfig', {
          savePrivateKey: 'true',
          refreshTime: '30',
          lastOrganizationId: null,
          theme: 'light',
        });
        DBUser.createUserConfig({
          userConfig: {
            email: myEmail,
            savePrivateKey: 'true',
            refreshTime: '30',
            lastOrganizationId: null,
            theme: 'light',
          },
        });
      } else {
        DBUser.createUserConfig({
          userConfig: {
            email: myEmail,
            savePrivateKey: 'false',
            refreshTime: '30',
            lastOrganizationId: null,
            theme: 'light',
          },
        });
        store.set('userConfig', {
          refreshTime: '30',
          theme: 'light',
          savePrivateKey: 'false',
          lastOrganizationId: null,
        });
      }
    }
  } else {
    store.set('userConfig', {
      refreshTime: userConfig[0].refreshTime,
      theme: userConfig[0].theme,
      savePrivateKey: userConfig[0].savePrivateKey,
      lastOrganizationId: userConfig[0].lastOrganizationId,
    });
  }
  return {
    response: IPCTypes.SET_USER_CONFIG_RESPONSE,
  };
}

export async function getUser() {
  const { accessToken, tokenType } = store.get('token') as IToken;
  const apiGetUser = await APIUser.getUser({
    authorization: `${tokenType} ${accessToken}`,
  }).catch(() => {
    return { status: 401, data: { full_name: '' } };
  });

  if (apiGetUser.status === 401) {
    return {
      response: 'leave-response',
      data: {
        type: 'sessionExpired',
      },
    };
  }

  store.set('user', {
    ...(store.get('user') as IUser),
    myFullName: apiGetUser.data?.full_name,
  });

  return {
    response: IPCTypes.GET_USER_RESPONSE,
    data: {
      status: 200,
      data: {},
    },
  };
}

export async function updateUserConfig(arg: UseIPCData) {
  const { myEmail } = store.get('user') as IUser;
  const data = await DBUser.updateUserConfig({ userConfig: arg.data, myEmail });
  store.set('userConfig', arg.data);

  return {
    response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
    data,
  };
}

const user = [
  {
    async createUser(event: Electron.IpcMainEvent, arg: ICreateUser[]) {
      const { myEmail, myFullName, safetyPhrase } = arg[0];
      axios
        .post(`${api}/user`, {
          full_name: myFullName,
          email: myEmail.toLowerCase(),
        })
        .then((result) => {
          store.set('register', { register: true });
          store.set('user', { myEmail, myFullName, safetyPhrase });
          event.reply('createUser-response', {
            status: result.status,
            data: result.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  {
    async refreshToken(_event: Electron.IpcMainEvent, _arg: unknown) {
      const { tokenType, accessToken } = store.get('token') as IToken;
      axios
        .get(`${api}/auth/token`, {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        })
        .then((result) => {
          store.set('token', {
            accessToken: result.data.access_token,
            tokenType: result.data.token_type,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  {
    async changeSafetyPhrase(event: Electron.IpcMainEvent, arg: any) {
      const { myEmail, safetyPhrase } = store.get('user') as IUser;
      const newSafetyPhrase = arg[0].newSecret;
      const { PATH } = store.get('initialData') as IInitialData;
      const db = await database.CreateDatabase({ myEmail, PATH });
      await DB.Init({ db, secret: safetyPhrase });

      if (newSafetyPhrase !== undefined) {
        try {
          const success = await database.ChangeSafetyPhrase({
            newSafetyPhrase,
            db,
          });

          if (success) {
            db.run(`PRAGMA rekey = '${newSafetyPhrase}'`);
            store.set('user', {
              ...(store.get('user') as IUser),
              safetyPhrase: newSafetyPhrase,
            });
            event.reply('changeSafetyPhrase-response', {
              status: 200,
              data: {
                status: 'ok',
              },
            });
          } else {
            console.log('Error ChangeSafetyPhrase');
            event.reply('changeSafetyPhrase-response', {
              status: 400,
              data: {
                status: 'ok',
              },
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
];

export default user;
