import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface LeaveOrganizationProps {
  authorization: string;
  organizationId: string;
}

const leaveOrganization = async ({
  authorization,
  organizationId,
}: LeaveOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .delete(`${api}/organizacao/user/leave`, {
      headers: {
        Authorization: authorization,
      },
      params: {
        id: organizationId,
      },
    })
    .then(async (result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API LEAVE ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default leaveOrganization;
