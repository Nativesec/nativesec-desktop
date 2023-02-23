export interface IOrganization {
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

export interface IIcon {
  _id: string;
  icone: string;
}

export interface IOrganizationInvite {
  _id: {
    $oid: string;
  };
  nome: string;
}

export interface IOrganizationRefreshResponse {
  iconeAllResponse: boolean;
  organizationsResponse: boolean;
}

export interface IChangeOrganizationResponse {
  status: number;
  data: {
    status: string;
    msg: any[];
  };
  organizationId: string;
}

export interface IDeleteInviteParticipantResponse {
  status: number;
  data: {
    status: string;
    msg: any;
  };
  organizationId: string;
}

export interface IInviteParticipantResponse {
  status: number;
  data: {
    status: string;
    msg: any;
  };
  organizationId: string;
}

export interface IDeclineInviteResponse {
  status: number;
  data: any;
  organizationId: string;
}

export interface IAcceptInviteResponse {
  status: number;
  data: any;
  organizationId: string;
}
