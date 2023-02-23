import * as openpgp from 'openpgp';

export interface ICreateKey {
  passphrase: string;
  name: string;
  email: string;
  comment?: string;
}

export interface ICreateKeyResponse {
  privateKeyArmored: string;
  publicKeyArmored: string;
}

export interface IEncrypt {
  publicKeysArmored: string[];
  message: string;
}

export interface IEncryptResponse {
  encryptedMessage: openpgp.WebStream<string>;
}

export interface IDecrypt {
  passphrase: string;
  encryptedMessage: string;
}

export interface IDecryptResponse {
  message: string;
}

export interface IValidateKey {
  privateKeyArmored: string;
  safetyPhrase: string;
}

export interface IValidateKeyResponse {
  valid: boolean;
}

export interface IChangePassphrase {
  email: string;
  name: string;
  privateKeyArmored: string;
  oldPassphrase: string;
  newPassphrase: string;
}

export interface IChangePassphraseResponse {
  privateKeyArmored: string;
}

export interface IGenerateKey {
  myEmail: string;
  myFullName: string;
  safetyPhrase: string;
}

export interface IGenerateParKeys {
  privateKey: string;
  publicKey: string;
}

const { enums } = openpgp;
export const DEFAULT_TYPE = 'rsa';
export const DEFAULT_RSA_BITS = 4096;
export const MIN_LENGTH_PASSPHRASE = 12;
export const DEFAULT_HASH = enums.hash.sha512;
export const DEFAULT_CIPHER = enums.symmetric.aes256;
