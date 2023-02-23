/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-cycle */
import * as openpgp from 'openpgp';
import { validateEmail } from './utils';

import * as types from './types';
import { store } from '../main';
import { IKeys } from '../types';

async function createKey({
  email,
  name,
  passphrase,
  comment,
}: types.ICreateKey): Promise<types.ICreateKeyResponse> {
  const emailToLower = email.toLowerCase();

  //  Validate email
  if (typeof emailToLower !== 'string') {
    throw new Error('invalid email, email must be a string');
  }
  if (!validateEmail(emailToLower)) {
    throw new Error('invalid email, poorly formatted email');
  }
  if (typeof name !== 'string') {
    throw new Error('invalid name, name must be a string');
  }
  if (typeof passphrase !== 'string') {
    throw new Error('invalid passphrase, passphrase must be a string');
  }
  if (passphrase.length < types.MIN_LENGTH_PASSPHRASE) {
    throw new Error(
      `invalid passphrase, passphrase must be at least ${types.MIN_LENGTH_PASSPHRASE} characters`
    );
  }

  const keypair = await openpgp.generateKey({
    userIDs: [{ email: emailToLower, name }],
    type: types.DEFAULT_TYPE as 'rsa' | 'ecc' | undefined,
    rsaBits: types.DEFAULT_RSA_BITS,
    passphrase,
    format: 'armored',
    config: {
      preferredHashAlgorithm: types.DEFAULT_HASH,
      preferredSymmetricAlgorithm: types.DEFAULT_CIPHER,
    },
  });

  return {
    privateKeyArmored: keypair.privateKey,
    publicKeyArmored: keypair.publicKey,
  };
}

async function encrypt({
  message,
  publicKeysArmored,
}: types.IEncrypt): Promise<types.IEncryptResponse> {
  const tempPublicKeysArmored: Array<string> = [];
  if (typeof message !== 'string') {
    throw new Error('invalid message, message must be a message');
  }

  if (publicKeysArmored.length === 0) {
    throw new Error(
      'invalid publicKeysArmored, message cannot be an empty array'
    );
  }

  publicKeysArmored.forEach((publicKeyArmored) => {
    if (tempPublicKeysArmored.indexOf(publicKeyArmored) === -1) {
      tempPublicKeysArmored.push(publicKeyArmored);
    }
  });
  const publicKeys = await Promise.all(
    tempPublicKeysArmored.map((armoredKey) => openpgp.readKey({ armoredKey }))
  );

  const encryptedMessage = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: publicKeys,
  });

  return { encryptedMessage };
}

async function decrypt({ encryptedMessage, passphrase }: types.IDecrypt) {
  try {
    const keys = store.get('keys') as IKeys;
    const privateKeyArmored = keys.privateKey;
    if (typeof encryptedMessage !== 'string') {
      throw new Error(
        'invalid encryptedMessage, encryptedMessage must be a encryptedMessage'
      );
    }
    if (encryptedMessage.length === 0) {
      throw new Error(
        'invalid encryptedMessage, encryptedMessage cannot be an empty string'
      );
    }
    if (typeof passphrase !== 'string') {
      throw new Error('invalid passphrase, passphrase must be a string');
    }
    if (privateKeyArmored.length === 0) {
      throw new Error(
        'invalid privateKeyArmored, message cannot be an empty string'
      );
    }

    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({
        armoredKey: privateKeyArmored,
      }),
      passphrase,
    });

    const armoredMessage = await openpgp.readMessage({
      armoredMessage: encryptedMessage.toString(),
    });

    const { data: decrypted } = await openpgp.decrypt({
      message: armoredMessage,
      decryptionKeys: privateKey,
    });

    return decrypted;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

async function changePassphrase({
  email,
  name,
  oldPassphrase,
  newPassphrase,
  privateKeyArmored,
}: types.IChangePassphrase) {
  try {
    const emailToLower = email.toLowerCase();

    if (typeof emailToLower !== 'string') {
      throw new Error('invalid email, email must be a string');
    }
    if (!validateEmail(emailToLower)) {
      throw new Error('invalid email, poorly formatted email');
    }
    if (typeof name !== 'string') {
      throw new Error('invalid name, name must be a string');
    }
    if (typeof oldPassphrase !== 'string') {
      throw new Error('invalid oldPassphrase, oldPassphrase must be a string');
    }
    if (typeof newPassphrase !== 'string') {
      throw new Error('invalid newPassphrase, newPassphrase must be a string');
    }
    if (newPassphrase.length < types.MIN_LENGTH_PASSPHRASE) {
      throw new Error(
        `invalid newPassphrase, newPassphrase must be at least ${types.MIN_LENGTH_PASSPHRASE} characters`
      );
    }

    if (privateKeyArmored.length === 0) {
      throw new Error(
        'invalid privateKeyArmored, message cannot be an empty string'
      );
    }

    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({
        armoredKey: privateKeyArmored,
      }),
      passphrase: oldPassphrase,
    });

    const { privateKey: newPrivateKeyArmored } = await openpgp.reformatKey({
      privateKey,
      userIDs: [{ name, email: email.toLowerCase() }],
      passphrase: newPassphrase,
    });

    return { privateKey: newPrivateKeyArmored };
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

async function validateKey({
  privateKeyArmored,
  safetyPhrase,
}: types.IValidateKey) {
  try {
    if (typeof safetyPhrase !== 'string') {
      throw new Error('invalid passphrase, passphrase must be a string');
    }
    if (privateKeyArmored.length === 0) {
      throw new Error(
        'invalid privateKeyArmored, message cannot be an empty string'
      );
    }
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({
        armoredKey: privateKeyArmored,
      }),
      passphrase: safetyPhrase,
    });

    if (privateKey !== null || privateKey !== undefined) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
async function generateKey({
  myEmail,
  myFullName,
  safetyPhrase,
}: types.IGenerateKey) {
  try {
    const emailToLower = myEmail.toLowerCase();

    if (typeof emailToLower !== 'string') {
      throw new Error('invalid email, email must be a string');
    }
    if (!validateEmail(emailToLower)) {
      throw new Error('invalid email, poorly formatted email');
    }
    if (typeof myFullName !== 'string') {
      throw new Error('invalid full_name, full_name must be a string');
    }
    if (typeof safetyPhrase !== 'string') {
      throw new Error('invalid passphrase, passphrase must be a string');
    }
    if (safetyPhrase.length < types.MIN_LENGTH_PASSPHRASE) {
      throw new Error(
        `invalid passphrase, passphrase must be at least ${types.MIN_LENGTH_PASSPHRASE} characters`
      );
    }

    const keypair = await openpgp.generateKey({
      userIDs: [{ email: emailToLower, name: myFullName }],
      type: types.DEFAULT_TYPE,
      rsaBits: types.DEFAULT_RSA_BITS,
      passphrase: safetyPhrase,
      format: 'armored',
      config: {
        preferredHashAlgorithm: types.DEFAULT_HASH,
        preferredSymmetricAlgorithm: types.DEFAULT_CIPHER,
      },
    });

    return {
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey,
    };
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
const generateParKeys = async ({
  myEmail,
  myFullName,
  safetyPhrase,
}: types.IGenerateKey): Promise<types.IGenerateParKeys | undefined> => {
  let keys;

  try {
    keys = await generateKey({
      myEmail,
      myFullName,
      safetyPhrase,
    });
    if (keys?.privateKey === undefined || keys.publicKey === undefined) {
      throw new Error("can't generate a openpgp key");
    }
  } catch (err) {
    console.error(err);
  }
  return keys;
};

export default {
  createKey,
  encrypt,
  decrypt,
  changePassphrase,
  validateKey,
  generateKey,
  generateParKeys,
};
