import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';

export interface ListOrganizationIconsProps {
  authorization: string;
}

const listOrganizationIcons = async ({
  authorization,
}: ListOrganizationIconsProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/organizacao/icone-all`, {
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
      return {
        status: error.response?.status,
        data: error.response.statusText,
      };
    });
};

export default listOrganizationIcons;
