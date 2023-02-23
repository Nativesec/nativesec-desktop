import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

interface ListSafeBoxesDeletedData {
  date: number;
  authorization: string;
  organizationId: string;
}

export async function listSafeBoxesDeleted({
  date,
  authorization,
  organizationId,
}: ListSafeBoxesDeletedData): Promise<IDefaultApiResult> {
  return axios
    .get(`${api}/cofre/list_deleted`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        data: date,
        organizacao: organizationId,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
