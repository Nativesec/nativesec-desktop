import axios from 'axios';
import { api } from '../../util';
import { IDefaultApiResult } from '../../../renderer/types';

export interface GetOrganizationIConProps {
  organizationId: string;
  authorization: string;
}
const getOrganizationIcon = ({
  organizationId,
  authorization,
}: GetOrganizationIConProps): Promise<IDefaultApiResult> => {
  return axios
    .get(`${api}/organizacao/icone?id=${organizationId}`, {
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
      console.log(error, ' ERROR API GET ORGANIZATION ICON');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default getOrganizationIcon;
