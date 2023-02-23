import axios from 'axios';
import { api } from '../../util';
import { IDefaultApiResult } from '../../../renderer/types';

export interface GetOrganizationProps {
  authorization: string;
  organizationId: string;
}

const getOrganization = async ({
  authorization,
  organizationId,
}: GetOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/organizacao/`, {
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
      console.log(error, ' ERROR API GET ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default getOrganization;
