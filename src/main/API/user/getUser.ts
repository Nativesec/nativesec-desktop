import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

interface GetUserData {
  authorization: string;
}

export async function getUser({
  authorization,
}: GetUserData): Promise<IDefaultApiResult> {
  return axios
    .get(`${api}/user/`, {
      headers: {
        Authorization: authorization,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERRO API GET USER');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
