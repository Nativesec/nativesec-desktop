export interface IResponseOrganizationList {
  status: string;
  msg?: {
    _id: {
      $oid: string;
    };
    nome: string;
  }[];
}

export interface IIconeAll {
  type?: string;
}
export interface IToken {
  accessToken: string;
  tokenType: string;
}

export interface ICreateOrganization {
  name: string;
  theme: string;
  description: string;
  icon: string;
  adminGuests: string[];
  participantGuests: string[];
}

export interface IInviteParticipant {
  organizationId: string;
  user: {
    email: string;
    isAdmin: boolean;
  };
}

export interface IDeleteInviteParticipant {
  organizationId: string;
  user: {
    email: string;
    type: 'participant' | 'admin';
  };
}

export interface IDeleteOrganization {
  organizationId: string;
}

export interface IChangeOrganization {
  organizationId: string;
  icon: string;
  updateDate: number;
  name: string;
  description: string;
  theme: string;
  limitUsers: number;
  storageLimit: number;
  ownerEmail: string;
  adminGuests: string;
  participantGuests: string;
  participants: string;
  admins: string;
  deleted: string;
}

export interface ILeaveOrganization {
  organizationId: string;
}

export interface IRemoveUser {
  type: 'participant' | 'admin';
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

export interface ISafeBoxDatabase {
  anexos: string;
  conteudo: string;
  criptografia: string;
  data_hora_create: number;
  data_atualizacao: number;
  usuarios_leitura_deletado: string;
  usuarios_escrita_deletado: string;
  descricao: string;
  nome: string;
  organizacao: string;
  tipo: string;
  usuarios_escrita: string;
  usuarios_leitura: string;
  _id: string;
}

export interface IIconsDatabase {
  _id: string;
  icone: string;
}

export interface IAcceptInvite {
  organizationId: string;
}

export interface IDeclineInvite {
  organizationId: string;
}
