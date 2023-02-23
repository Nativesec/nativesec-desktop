import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

interface GetPrivateKeyData {
  email: string;
  authorization: string;
}

export async function getPrivateKey({
  email,
  authorization,
}: GetPrivateKeyData): Promise<IDefaultApiResult> {
  return axios
    .get(`${api}/privatekey/`, {
      params: {
        email,
      },
      headers: {
        Authorization: authorization,
      },
    })
    .then(async (result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, 'ERROR API GET PRIVATE KEY');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
