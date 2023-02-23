import axios from 'axios';
import { api } from '../../util';

export interface InviteParticipantProps {
  type: string;
  organizationId: string;
  email: string;
  authorization: string;
}

const inviteParticipant = async ({
  type,
  organizationId,
  email,
  authorization,
}: InviteParticipantProps) => {
  return axios
    .post(
      `${api}/organizacao/invitation/${type}/?id=${organizationId}&user=${email}`,
      {},
      {
        headers: {
          Authorization: authorization,
        },
      }
    )
    .then(async (result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERRO API ORGANIZATION INVITE PARTICIPANT');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default inviteParticipant;
