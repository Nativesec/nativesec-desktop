import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface ListSafeBoxProps {
  organizationId: string;
  authorization: string;
  date: number;
}

const listSafeBox = async ({
  organizationId,
  authorization,
  date,
}: ListSafeBoxProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/cofre/list`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        organizacao: organizationId,
        data: date,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API LIST SAFE BOX');
      return {
        status: error.response.status,
        data: error.response,
      };
    });
};

export default listSafeBox;
