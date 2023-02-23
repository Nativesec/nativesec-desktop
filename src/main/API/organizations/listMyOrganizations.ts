import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface ListMyOrganizationProps {
  authorization: string;
}

const listMyOrganizations = async ({
  authorization,
}: ListMyOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/organizacao/my`, {
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
      console.log(error, ' ERROR API LIST MY ORGANIZATIONS');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default listMyOrganizations;
