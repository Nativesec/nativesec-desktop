export interface ICreateUser {
  myEmail: string;
  myFullName: string;
  safetyPhrase: string;
}

export interface IUserConfig {
  email: string;
  refreshTime: string;
  savePrivateKey: boolean;
  theme: 'light' | 'dark';
  lastOrganizationId: string;
}

export interface ISetTheme {
  theme: 'light' | 'dark';
}

export interface IChangeSafetyPhrase {
  newSecret: string;
}
