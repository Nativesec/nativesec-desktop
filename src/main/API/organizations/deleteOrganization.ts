import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface DeleteOrganizationProps {
  organizationId: string;
  authorization: string;
}

const deleteOrganization = async ({
  organizationId,
  authorization,
}: DeleteOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .delete(`${api}/organizacao/`, {
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
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default deleteOrganization;
