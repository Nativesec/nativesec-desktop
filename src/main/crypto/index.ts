/* eslint-disable import/no-cycle */
import { IpcMainEvent } from 'electron';
import { store } from '../main';
import { IUser } from '../types';
import openpgp from './openpgp';
import * as types from './types';

const crypto = [
  {
    async createKey(event: IpcMainEvent, arg: types.ICreateKey) {
      const { email, name, passphrase, comment } = arg;
      const key = await openpgp.createKey({ email, name, passphrase, comment });
      event.reply('createKeyResponse', key);
    },
  },
  {
    async encrypt(event: IpcMainEvent, arg: types.IEncrypt) {
      const { message, publicKeysArmored } = arg;
      const encrypted = await openpgp.encrypt({ message, publicKeysArmored });
      event.reply('encryptResponse', encrypted);
    },
  },
  {
    async decrypt(event: IpcMainEvent, arg: types.IDecrypt[]) {
      const { safetyPhrase } = store.get('user') as IUser;
      const encryptedMessage = String(arg[0]);
      const decrypted = await openpgp.decrypt({
        encryptedMessage,
        passphrase: safetyPhrase,
      });

      event.reply('decrypt-response', {
        name: arg[1],
        decrypted,
        position: arg[2],
        type: arg[3],
      });
    },
  },
  {
    async validateKey(event: IpcMainEvent, arg: types.IValidateKey) {
      const { privateKeyArmored, safetyPhrase } = arg;
      const valid = await openpgp.validateKey({
        privateKeyArmored,
        safetyPhrase,
      });
      event.reply('validateKeyResponse', valid);
    },
  },
  {
    async changePassphrase(event: IpcMainEvent, arg: types.IChangePassphrase) {
      const { email, name, oldPassphrase, newPassphrase, privateKeyArmored } =
        arg;
      const privateKey = await openpgp.changePassphrase({
        email,
        name,
        oldPassphrase,
        newPassphrase,
        privateKeyArmored,
      });
      event.reply('changePassphraseResponse', privateKey);
    },
  },
];

export default crypto;
