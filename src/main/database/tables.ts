export interface ITables {
  name: string;
  query: string;
}

const tables = [
  {
    name: 'private_keys',
    query:
      'CREATE TABLE IF NOT EXISTS private_keys (email TEXT, full_name TEXT, private_key TEXT, workspaceId TEXT, type TEXT)',
  },
  {
    name: 'public_keys',
    query:
      'CREATE TABLE IF NOT EXISTS public_keys (email TEXT, full_name TEXT, public_key TEXT, workspaceId TEXT, type TEXT)',
  },
  {
    name: 'user_config',
    query:
      'CREATE TABLE IF NOT EXISTS user_config (email TEXT, refreshTime INTEGER, savePrivateKey TEXT, theme TEXT, lastOrganizationId TEXT);',
  },
  {
    name: 'version',
    query: 'CREATE TABLE IF NOT EXISTS database_version (version TEXT)',
  },
  {
    name: 'organizationsIcons',
    query: `CREATE TABLE IF NOT EXISTS organizationsIcons (
      _id TEXT,
      icone TEXT
    )`,
  },
  {
    name: 'organizations',
    query: `CREATE TABLE IF NOT EXISTS organizations (
      _id TEXT,
      data_criacao INTEGER,
      nome TEXT,
      tema TEXT,
      dono TEXT,
      descricao TEXT,
      data_atualizacao INTEGER,
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
      usuarios_leitura_deletado TEXT,
      usuarios_escrita_deletado TEXT,
      _id TEXT
      )`,
  },
];

export default tables;
