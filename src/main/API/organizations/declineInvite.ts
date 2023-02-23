import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface DeclineInviteProps {
  authorization: string;
  organizationId: string;
}

const declineInvite = async ({
  authorization,
  organizationId,
}: DeclineInviteProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/invitation/decline`, {
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
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default declineInvite;
