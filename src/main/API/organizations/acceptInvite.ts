import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface AcceptInviteProps {
  authorization: string;
  organizationId: string;
}

const acceptInvite = ({
  authorization,
  organizationId,
}: AcceptInviteProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/invitation/accept`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        id: organizationId,
      },
    })
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API ACCEPT INVITE');
      return {
        status: error.response.status,
        data: error.response.data,
      };
    });
};

export default acceptInvite;
