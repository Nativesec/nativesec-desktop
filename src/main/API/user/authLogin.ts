import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

interface AuthLoginData {
  email: string;
  password: string;
}

export async function authLogin({
  email,
  password,
}: AuthLoginData): Promise<IDefaultApiResult> {
  return axios
    .post(`${api}/auth/login`, {
      email,
      password,
    })
    .then((result) => {
      return {
        status: result.status,
        data: {
          status: 'ok',
          msg: result.data,
        },
      };
    })
    .catch((error) => {
      console.log(error, 'ERROR API AUTH LOGIN');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
