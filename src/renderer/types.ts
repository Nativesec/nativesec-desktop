export interface IDefaultApiResult {
  status: number;
  data?: {
    status?: string;
    msg?: any;
    id?: string;
    detail?: any[];
    databaseExists?: boolean;
    full_name?: string;
    createPrivate?: boolean;
    createPublic?: boolean;
    iconeAllResponse?: boolean;
    organizationsResponse?: boolean;
  };
}

export interface IDeleteSafeBoxResponse {
  status: number;
  data?: {
    status?: string;
    msg?: any;
    id?: string;
  };
  deletedId?: string;
}
export interface IGenerateParKeysResponse {
  createPrivate: boolean;
  createPublic: boolean;
}
