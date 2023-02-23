import sqlite3 from '@journeyapps/sqlcipher';

// Adicionar em index.ts a nova versao

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
      db.run(table.query, async (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
  );
}
