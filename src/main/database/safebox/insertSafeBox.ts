import { ISafeBoxDatabase } from 'renderer/pages/Workspace/types';
import database from '../database';
import { RunReturn } from '../types';

export interface InsertSafeBoxProps {
  safeBox: ISafeBoxDatabase;
}

const insertSafeBox = ({ safeBox }: InsertSafeBoxProps): RunReturn => {
  return database.run(
    `INSERT INTO safebox (
      _id,
      anexos ,
      conteudo ,
      criptografia ,
      data_hora_create ,
      data_atualizacao ,
      descricao ,
      nome ,
      organizacao ,
      tipo ,
      usuarios_escrita ,
      usuarios_leitura
    ) VALUES (
      '${safeBox._id}',
      '${safeBox.anexos}',
      '${safeBox.conteudo}',
      '${safeBox.criptografia}',
      '${safeBox.data_hora_create}',
      '${safeBox.data_atualizacao}',
      '${safeBox.descricao}',
      '${safeBox.nome}',
      '${safeBox.organizacao}',
      '${safeBox.tipo}',
      '${safeBox.usuarios_escrita}',
      '${safeBox.usuarios_escrita}'
    )`
  );
};

export default insertSafeBox;
