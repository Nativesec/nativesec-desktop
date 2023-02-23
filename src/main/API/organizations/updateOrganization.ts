import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';
import { IUpdateOrganization } from './types';

export interface UpdateOrganizationProps {
  authorization: string;
  data: IUpdateOrganization;
}

const updateOrganization = async ({
  authorization,
  data,
}: UpdateOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .put(
      `${api}/organizacao/`,
      {
        id: data.organizationId,
        nome: data.name,
        tema: data.theme,
        descricao: data.description,
        icone: data.icon,
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    )
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      };
    })
    .catch((error) => {
      console.log(error, ' ERROR API UPDATE ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default updateOrganization;
