export interface ICreateSafeBox {
  _id: any;
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  tipo: string;
  criptografia: string;
  nome: string;
  descricao: string;
  conteudo: any[];
  organizacao: string;
}

export interface IChangeSafeBox {
  id: string;
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  tipo: string;
  criptografia: string;
  nome: string;
  descricao: string;
  conteudo: any[];
  organizacao: string;
  data_hora_create: number;
  data_atualizacao: number;
}

export interface ISafeBox {
  anexos: string[];
  conteudo: string;
  criptografia: string;
  data_hora_create: {
    $date: number;
  };
  data_atualizacao: {
    $date: number;
  };
  descricao: string;
  nome: string;
  organizacao: string;
  tipo: string;
  usuarios_escrita: string[];
  usuarios_leitura: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  _id: {
    $oid: string;
  };
}

export interface IGetSafeBox {
  organizationId: string;
  safeBoxId: string;
}

export interface IDeleteSafeBox {
  organizationId: string;
  safeBoxId: string;
}

export interface IListSafeBox {
  organizationId: string;
  type?: string;
  deletedId?: string;
}

export interface IGetAllSafeBox {
  organizationId: string;
  type?: string;
}
