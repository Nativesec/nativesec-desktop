import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface deleteSafeBoxProps {
  authorization: string;
  organizationId: string;
  safeBoxId: string;
}

const deleteSafeBox = async ({
  authorization,
  organizationId,
  safeBoxId,
}: deleteSafeBoxProps): Promise<IDefaultApiResult> => {
  return axios
    .delete(`${api}/cofre/`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        organizacao: organizationId,
        id: safeBoxId,
      },
    })
    .then(async (result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' API DELETE SAFE BOX ERROR');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default deleteSafeBox;
