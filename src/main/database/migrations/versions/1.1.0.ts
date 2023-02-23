import sqlite3 from '@journeyapps/sqlcipher';
import { myDatabase } from '../../../ipc/database';

export interface ITables {
  name: string;
  query: string;
}

const tables = [
  {
    name: 'organizations',
    query: `
      CREATE TABLE IF NOT EXISTS organizations (
      _id TEXT,
      data_criacao TEXT,
      descricao TEXT,
      nome TEXT,
      tema TEXT,
      dono TEXT,
      data_atualizacao TEXT,
      convidados_participantes TEXT,
      convidados_administradores TEXT,
      limite_usuarios INTEGER,
      limite_armazenamento INTEGER,
      participantes TEXT,
      administradores TEXT,
      deletado TEXT
    )`,
  },
  {
    name: 'organizationsIcons',
    query: `CREATE TABLE IF NOT EXISTS organizationsIcons (
      _id TEXT,
      icone TEXT
    )`,
  },
  {
    name: 'safebox',
    query: `CREATE TABLE IF NOT EXISTS safebox (
      anexos TEXT,
      conteudo TEXT,
      criptografia TEXT,
      data_hora_create INTEGER,
      data_atualizacao INTEGER,
      descricao TEXT,
      nome TEXT,
      organizacao TEXT,
      tipo TEXT,
      usuarios_escrita TEXT,
      usuarios_leitura TEXT,
      _id TEXT
      )`,
  },
];

const update = async (db: sqlite3.Database) => {
  await Promise.all(
    tables.map(async (table) => {
      myDatabase.run(table.query, async (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
  );
};

export { update };
