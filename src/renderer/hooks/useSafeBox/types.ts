import { ISafeBox } from 'renderer/contexts/safeBoxesContext/types';

export interface IChangeSafeBoxResponse {
  status: number;
  data: {
    status: string;
    msg: any[];
  };
  safeBoxId: string;
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

export interface IGetAllSafeBoxResponse {
  safeBoxResponse: boolean;
}
export interface IGetSafeBoxResponse {
  safeBox: ISafeBox;
}
