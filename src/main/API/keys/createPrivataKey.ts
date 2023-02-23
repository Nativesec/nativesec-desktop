import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { DEFAULT_TYPE } from '../../crypto/types';
import { api } from '../../util';

interface CreatePrivateKeyData {
  authorization: string;
  privateKey: string;
}

export async function createPrivateKey({
  authorization,
  privateKey,
}: CreatePrivateKeyData): Promise<IDefaultApiResult> {
  return axios
    .post(
      `${api}/privatekey/`,
      {
        chave: privateKey,
        tipo: DEFAULT_TYPE,
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    )
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API CREATE PRIVATE KEY');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
