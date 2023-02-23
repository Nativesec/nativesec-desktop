import database from '../database';
import { RunReturn } from '../types';
import { IDBCreateSafeBox } from './types';

export interface CreateSafeBoxProps {
  safeBox: IDBCreateSafeBox;
}

export async function createSafeBox({
  safeBox,
}: CreateSafeBoxProps): RunReturn {
  return database.run(
    `INSERT INTO safebox (
      _id,
      anexos ,
      conteudo ,
      criptografia ,
      descricao ,
      nome ,
      organizacao ,
      tipo ,
      data_hora_create,
      data_atualizacao,
      usuarios_escrita_deletado,
      usuarios_leitura_deletado,
      usuarios_escrita ,
      usuarios_leitura
    ) VALUES (
      '${safeBox.id}',
      '${safeBox.anexos}',
      '${safeBox.conteudo}',
      '${safeBox.criptografia}',
      '${safeBox.descricao}',
      '${safeBox.nome}',
      '${safeBox.organizacao}',
      '${safeBox.tipo}',
      '${safeBox.data_hora_create}',
      '${safeBox.data_atualizacao}',
      '${safeBox.usuarios_escrita_deletado}',
      '${safeBox.usuarios_leitura_deletado}',
      '${safeBox.usuarios_escrita}',
      '${safeBox.usuarios_leitura}'
    )`
  );
}
