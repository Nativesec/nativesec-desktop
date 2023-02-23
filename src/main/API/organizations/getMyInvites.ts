import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface GetMyInvitesProps {
  authorization: string;
}

const getMyInvites = async ({
  authorization,
}: GetMyInvitesProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/organizacao/my-invite`, {
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
      console.log(error, ' ERROR API GET MY INVITES');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default getMyInvites;
