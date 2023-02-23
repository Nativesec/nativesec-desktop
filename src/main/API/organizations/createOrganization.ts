import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { ICreateOrganization } from '../../ipc/organizations/types';
import { api } from '../../util';

export interface CreateOrganizationProps {
  data: ICreateOrganization;
  authorization: string;
}

const createOrganization = async ({
  data,
  authorization,
}: CreateOrganizationProps): Promise<IDefaultApiResult> => {
  return axios
    .post(
      `${api}/organizacao/`,
      {
        nome: data.name,
        tema: data.theme,
        descricao: data.description,
        icone: data.icon,
        convidados_administradores: [],
        convidados_participantes: [],
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
      console.log(error, ' ERROR API CREATE ORGANIZATION');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default createOrganization;
