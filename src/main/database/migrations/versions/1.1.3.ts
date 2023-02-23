import sqlite3 from '@journeyapps/sqlcipher';
import { myDatabase } from '../../../ipc/database';

export interface ITables {
  name: string;
  query: string;
}

const tables = [
  {
    name: 'safeBoxAdmin',
    query: 'ALTER TABLE safebox ADD usuarios_leitura_deletado type TEXT',
  },
  {
    name: 'safeBoxParticipant',
    query: 'ALTER TABLE safebox ADD usuarios_escrita_deletado type TEXT',
  },
];

export async function update(db: sqlite3.Database) {
  await Promise.all(
    tables.map(async (table) => {
      await myDatabase.run(table.query);
    })
  );
}
