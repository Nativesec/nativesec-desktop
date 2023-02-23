export interface IGetPublicKeyResponse {
  status: number;
  data?: {
    status?: string;
    msg?: string;
  };
}

export interface IGenerateParKeyResponse {
  createPrivate: boolean;
  createPublic: boolean;
}

export interface IGetPrivateKeyResponse {
  status: number;
  databaseExists: boolean | undefined;
  data: {
    status: string;
    msg: string[];
  };
}
