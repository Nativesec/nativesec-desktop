import sqlite3 from '@journeyapps/sqlcipher';
import { IUserConfig } from 'main/ipc/user/types';

export interface ICreatePrivateKey {
  myEmail: string;
  myFullName: string;
  privateKey: string;
  db: sqlite3.Database;
}

export interface ICreatePublicKey {
  myEmail: string;
  myFullName: string;
  publicKey: string;
  db: sqlite3.Database;
}

export interface IGetLocalPrivateKeyProps {
  db: sqlite3.Database;
  myEmail: string;
}

export interface ISelectedOrganization {
  db: sqlite3.Database;
  userConfig: IUserConfig;
  myEmail: string;
}

export interface IGetSelectedOrganization {
  db: sqlite3.Database;
  myEmail: string;
}
export interface ICreateUserConfig {
  db: sqlite3.Database;
  myEmail: string;
  savePrivateKey: boolean;
}
export interface IGetPrivateKey {
  email: string;
  full_name: string;
  private_key: string;
  workspaceId: string;
  type: string;
}

export interface IGetLocalPublicKeyProps {
  db: sqlite3.Database;
  myEmail: string;
}

export interface IGetLocalPublicKey {
  email: string;
  full_name: string;
  public_key: string;
  workspaceId: string;
  type: string;
}

export interface IChangeSafetyPhrase {
  newSafetyPhrase: string;
  db: sqlite3.Database;
}

export type RunReturn = Promise<boolean | Error | null>;
export type AllRowReturn = Promise<any | Error | null>;
export type AllReturn = Promise<any[]>;

export type DatabaseReturnType = Promise<boolean | Error | null>;
export const DEFAULT_TYPE = 'rsa';
