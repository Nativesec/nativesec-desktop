/* eslint-disable import/no-cycle */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/naming-convention */
import { store } from '../../main';
import { IInitialData, IUser } from '../../types';
import database from '../../database/database';
import DB from '../../database/index';

const userLocal = [
  {
    async validateSafetyPhrase(event: Electron.IpcMainEvent, arg: any) {
      const { safetyPhrase } = arg[0];
      store.set('user', { ...(store.get('user') as IUser), safetyPhrase });
      const { myEmail } = store.get('user') as IUser;
      const { PATH } = store.get('initialData') as IInitialData;
      const db = await database.CreateDatabase({ myEmail, PATH });
      await DB.Init({ db, secret: safetyPhrase, event });
    },
  },
];

export default userLocal;
