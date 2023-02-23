import axios from 'axios';
import { api } from '../../util';
import { IDefaultApiResult } from '../../../renderer/types';
import { IApiChangeSafeBox } from './types';

export interface ChangeSafeBoxProps {
  newSafeBox: IApiChangeSafeBox;
  authorization: string;
}

const changeSafeBox = async ({
  newSafeBox,
  authorization,
}: ChangeSafeBoxProps): Promise<IDefaultApiResult> => {
  return axios
    .put(
      `${api}/cofre/`,
      {
        id: newSafeBox.id,
        usuarios_leitura: newSafeBox.usuarios_leitura,
        usuarios_escrita: newSafeBox.usuarios_escrita,
        usuarios_escrita_deletado: newSafeBox.usuarios_escrita_deletado,
        usuarios_leitura_deletado: newSafeBox.usuarios_leitura_deletado,
        conteudo: newSafeBox.conteudo,
        tipo: newSafeBox.tipo,
        nome: newSafeBox.nome,
        descricao: newSafeBox.descricao,
        organizacao: newSafeBox.organizacao,
        criptografia: 'rsa',
        anexos: [],
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
      console.log(error, 'ERROR API CHANGE SAFEBOX');
      return {
        status: error.response.status,
        data: error.response.msg,
      };
    });
};

export default changeSafeBox;
