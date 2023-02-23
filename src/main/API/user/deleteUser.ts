import axios from 'axios';
import { api } from '../../util';

interface DeleteUserData {
  authorization: string;
}

export async function deleteUser({ authorization }: DeleteUserData) {
  return axios
    .delete(`${api}/user`, {
      headers: {
        Authorizations: authorization,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API DELETE USER');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
}
