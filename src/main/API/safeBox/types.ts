export interface IApiChangeSafeBox {
  id: string;
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  tipo: string;
  criptografia: string;
  nome: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
  anexos: string;
}

export interface IApiCreateSafeBox {
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  conteudo: string;
  tipo: string;
  nome: string;
  descricao: string;
  organizacao: string;
  criptografia: string;
  anexos: [];
}
