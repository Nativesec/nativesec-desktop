import axios from 'axios';
import { IDefaultApiResult } from 'renderer/types';
import { api } from '../../util';
import { IApiCreateSafeBox } from './types';

export interface CreateSafeBoxProps {
  newSafeBox: IApiCreateSafeBox;
  authorization: string;
}

const createSafeBox = async ({
  newSafeBox,
  authorization,
}: CreateSafeBoxProps): Promise<IDefaultApiResult> => {
  return axios
    .post(
      `${api}/cofre/`,
      {
        usuarios_leitura: newSafeBox.usuarios_leitura,
        usuarios_escrita: newSafeBox.usuarios_escrita,
        conteudo: newSafeBox.conteudo,
        tipo: newSafeBox.tipo,
        nome: newSafeBox.nome,
        descricao: newSafeBox.descricao,
        organizacao: newSafeBox.organizacao,
        criptografia: newSafeBox.criptografia,
        anexos: newSafeBox.anexos,
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
      console.log(error, 'API ERROR CREATE SAFE BOX');
      return {
        status: error.response.status,
        data: error.response.statusText,
      };
    });
};

export default createSafeBox;
