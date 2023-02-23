import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface GetSafeBoxProps {
  organizationId: string;
  safeBoxId: string;
  authorization: string;
}

const getSafeBox = async ({
  authorization,
  organizationId,
  safeBoxId,
}: GetSafeBoxProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/cofre/`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        organizacao: organizationId,
        id: safeBoxId,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API GET SAFE BOX');
      return {
        status: error.response.status,
        data: error.response,
      };
    });
};

export default getSafeBox;
