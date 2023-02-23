import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface GetPubKeyProps {
  email: string;
  authorization: string;
}

const getPublicKey = async ({
  email,
  authorization,
}: GetPubKeyProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/pubkey/`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        email,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API GET PUB KEY');
      return {
        status: error.status,
        data: error.response.msg,
      };
    });
};

export default getPublicKey;
