import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface DeleteParticipantProps {
  type: string;
  organizationId: string;
  userEmail: string;
  authorization: string;
}

const deleteParticipant = async ({
  type,
  organizationId,
  userEmail,
  authorization,
}: DeleteParticipantProps): Promise<IDefaultApiResult> => {
  return axios
    .delete(`${api}/organizacao/user/${type}/`, {
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
      console.log(error, ' ERROR API DELETE PARTICIPANT ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default deleteParticipant;
