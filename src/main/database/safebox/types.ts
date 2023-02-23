export interface IDBUpdateSafeBox {
  id: string;
  usuarios_leitura: string;
  usuarios_escrita: string;
  usuarios_leitura_deletado: string;
  usuarios_escrita_deletado: string;
  tipo: string;
  data_hora_create: number;
  data_atualizacao: number;
  criptografia: string;
  nome: string;
  anexos: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
}

export interface IDBCreateSafeBox {
  id: string;
  usuarios_leitura: string;
  usuarios_escrita: string;
  usuarios_leitura_deletado: string;
  usuarios_escrita_deletado: string;
  data_hora_create: number;
  data_atualizacao: number;
  tipo: string;
  criptografia: string;
  nome: string;
  anexos: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
}
