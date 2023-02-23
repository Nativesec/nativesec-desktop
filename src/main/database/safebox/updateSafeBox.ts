import database from '../database';
import { IDBUpdateSafeBox } from './types';
import { RunReturn } from '../types';

export interface UpdateSafeBoxProps {
  newSafeBox: IDBUpdateSafeBox;
}

const updateSafeBox = async ({ newSafeBox }: UpdateSafeBoxProps): RunReturn => {
  return database.run(
    `
      UPDATE safebox SET
      anexos = '${newSafeBox.anexos}',
      conteudo = '${newSafeBox.conteudo}',
      criptografia = 'rsa',
      data_hora_create = '${newSafeBox.data_hora_create}',
      usuarios_escrita_deletado = '${newSafeBox.usuarios_escrita_deletado}',
      usuarios_leitura_deletado = '${newSafeBox.usuarios_leitura_deletado}',
      data_atualizacao = '${newSafeBox.data_atualizacao}',
      descricao = '${newSafeBox.descricao}',
      nome = '${newSafeBox.nome}',
      tipo = '${newSafeBox.tipo}',
      usuarios_escrita = '${newSafeBox.usuarios_escrita}',
      usuarios_leitura = '${newSafeBox.usuarios_leitura}'
      WHERE _id = '${newSafeBox.id}'
      AND organizacao = '${newSafeBox.organizacao}'
    `
  );
};

export default updateSafeBox;
