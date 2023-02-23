import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { DEFAULT_TYPE } from '../../crypto/types';
import { api } from '../../util';

interface CreatePublicKeyData {
  authorization: string;
  publicKey: string;
}

export async function createPublicKey({
  authorization,
  publicKey,
}: CreatePublicKeyData): Promise<IDefaultApiResult> {
  return axios
    .post(
      `${api}/pubkey/`,
      {
        chave: publicKey,
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
      console.log(error, ' ERROR API CREATE PUBLIC KEY');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
