/* eslint-disable import/no-unresolved */

import { IOrganizationDatabase } from 'renderer/routes/types';

export interface ICreateSafeBoxProps {
  isOpen: boolean;
}
export interface ICreateProps {
  value: number;
  organization: IOrganizationDatabase;
}

export interface IWorkspaceProps {
  refreshTime: number;
  handleSetIsLoading: (loading: boolean) => void;
}

export interface IDeleteOrganizationModalProps {
  isOpen: boolean;
  organization: IOrganizationDatabase | undefined;
  currentTheme: 'light' | 'dark' | '';
  onRequestClose: () => void;
}

export interface IChangeSafetyPhraseProps {
  currentTheme: 'light' | 'dark' | '';
}
export interface IUsersSettingsProps {
  refreshTime: number;
  handleRefreshTime: (newTime: number) => void;
}

export interface IVerifySafetyPhraseModalProps {
  currentTheme: 'light' | 'dark' | '';
  mode: string | undefined;
  isOpen: boolean;
  safeBoxName: string | undefined;
  setEditMode: (mode: boolean, type: 'edit' | 'decrypt') => void;
  onRequestClose: () => void;
  handleDeleteSafeBox: () => void;
  decrypt: () => void;
}

export interface ILeaveWorkspaceModal {
  currentTheme: 'light' | 'dark' | '';
  organization: IOrganizationDatabase | undefined;
  isOpen: boolean;
  onRequestClose: () => void;
}
export interface IIcons {
  icone: string | null;
  _id: {
    $oid: string;
  };
}
export interface ISelected {
  value: number;
  name: string;
}

export interface IDeleteUser {
  email: string;
  type: 'participant' | 'admin';
}

export interface IRemoveUser {
  email: string;
  type: 'participant' | 'admin';
}
export interface IValues {
  value: number;
  name: string;
  item: {
    name: string;
    text: string;
    element: string;
    type?: string;
  }[];
}

export interface IItem {
  name?: string;
  text?: string;
  type?: string;
  crypto?: boolean;
  [value: string]: any;
}

export interface IParticipant {
  email: string;
  type: 'participant' | 'admin';
  label: string;
  value: string;
}

export interface IError {
  message: string;
  type: 'participant' | 'admin';
}

export interface IListSafeBox {
  _id: {
    $oid: string;
  };
  nome: string;
  tipo: string;
}

export interface ISafeBox {
  anexos: string[];
  conteudo: string;
  criptografia: string;
  data_hora_create: {
    $date: number;
  };
  descricao: string;
  nome: string;
  organizacao: string;
  tipo: string;
  usuarios_escrita: string[];
  usuarios_leitura: string[];
  _id: {
    $oid: string;
  };
}

export interface IDecryptedMessage {
  name: string;
  decrypted: string;
  position: string;
  type: string;
}

export interface IChangeOrganization {
  name: string;
  description: string;
  icon: string;
  mainColor: string;
  secondColor: string;
}

export interface IChangeOrganizationResponse {
  status: number;
  data: {
    status: string;
    msg: any[];
  };
  organizationId: string;
}

export interface IChangeSafeBoxResponse {
  status: number;
  data: {
    status: string;
    msg: any[];
  };
  safeBoxId: string;
}

export interface IDeleteOrganization {
  organizationName: string;
  safetyPhrase: string;
}

export interface IChangeSafetyPhrase {
  safetyPhrase: string;
  newSafetyPhrase: string;
  confirmNewSafetyPhrase: string;
}

export interface ILeaveOrganization {
  organizationName: string;
  safetyPhrase: string;
}

export interface IConfirmSafetyPhrase {
  safeBoxName: string;
  safetyPhrase: string;
}

export interface IListSafeBoxResponse {
  status: number;
  data: {
    status: string;
    msg: any;
  };
  type: string;
  deletedId?: string;
}

export interface IInviteParticipantResponse {
  status: number;
  data: {
    status: string;
    msg: any;
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

export interface IMyFiles {
  type: 'create' | undefined;
  image: string;
}

export interface IItemDecrypt {
  text: string;
  itemName: string;
  position: string;
}

export interface IGetAllSafeBoxResponse {
  safeBoxResponse: boolean;
}

export interface IGetSafeBoxResponse {
  safeBox: ISafeBoxDatabase;
}

export interface ISafeBoxDatabase {
  anexos: string;
  conteudo: string;
  criptografia: string;
  data_hora_create: string;
  data_atualizacao: string;
  descricao: string;
  nome: string;
  organizacao: string;
  tipo: string;
  usuarios_escrita: string;
  usuarios_leitura: string;
  _id: string;
}

export interface ILeaveResponse {
  type?: string;
}
