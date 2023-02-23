import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface DeleteInviteProps {
  url: string;
  authorization: string;
  organizationId: string;
  userEmail: string;
}

const deleteInvite = async ({
  url,
  authorization,
  organizationId,
  userEmail,
}: DeleteInviteProps): Promise<IDefaultApiResult> => {
  return axios
    .delete(`${api}${url}`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        id: organizationId,
        user: userEmail,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API DELETE INVITE ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default deleteInvite;
