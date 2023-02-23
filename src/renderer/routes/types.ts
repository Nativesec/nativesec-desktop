export interface IMyInvite {
  _id: {
    $oid: string;
  };
  nome: string;
}

export interface IIconeAllResponse {
  status: number;
  data?: {
    status?: string;
    msg?: any;
    id?: string;
  };
  type?: string;
}

export interface IMyOrganization {
  _id: {
    $oid: string;
  };
  nome: string;
}

export interface IOrganization {
  _id: {
    $oid: string;
  };
  data_criacao: {
    $date: number;
  };
  nome: string;
  tema: string;
  descricao: string;
  dono: string;
  data_atualizacao: {
    $date: number;
  };
  convidados_participantes: string[];
  convidados_administradores: string[];
  limite_usuarios: number;
  limite_armazenamento: number;
  participantes: string[];
  administradores: string[];
  deletado: string;
}

export interface IOrganizationDatabase {
  _id: string;
  data_criacao: number;
  nome: string;
  tema: string;
  descricao: string;
  dono: string;
  data_atualizacao: number;
  convidados_participantes: string;
  convidados_administradores: string;
  limite_usuarios: number;
  limite_armazenamento: number;
  participantes: string;
  administradores: string;
  deletado: string;
}

export interface IIconsDatabase {
  _id: string;
  icone: string;
}
