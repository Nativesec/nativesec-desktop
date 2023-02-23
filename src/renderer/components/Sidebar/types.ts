// eslint-disable-next-line import/no-cycle

export interface IOrganizationsList {
  _id: {
    $oid: string;
  };
  nome: string;
}
export interface IResponseOrganizationsList {
  status: string;
  msg: {
    _id: {
      $oid: string;
    };
    nome: string;
  }[];
}

export interface IResponseOrganizationIcons {
  status: string;
  msg: {
    _id: {
      $oid: string;
    };
    icone: string | null;
  }[];
}

export interface IResponseOrganization {
  status: string;
  msg: {
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
    convidados_participantes: any[];
    convidados_administradores: any[];
    limite_usuarios: 5;
    limite_armazenamento: 10;
    participantes: [];
    administradores: [];
    deletado: false;
  }[];
}
export interface WorkspaceIconProps {
  icon?: string | null;
  workspaceName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  className?: string;
  type?: 'invite' | 'workspace';
}
