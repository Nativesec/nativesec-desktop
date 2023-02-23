import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface AuthPasswordData {
  email: string;
}

export async function authPassword({
  email,
}: AuthPasswordData): Promise<IDefaultApiResult> {
  return axios
    .get(`${api}/auth/password`, {
      params: { email },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API AUTH PASSWORD');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
