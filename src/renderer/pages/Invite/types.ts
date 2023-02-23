import { IMyInvite } from 'renderer/routes/types';

export interface IInviteProps {
  currentTheme: 'light' | 'dark';
  myInvites: IMyInvite[];
}

export interface IAcceptInviteResponse {
  status: number;
  data: any;
  organizationId: string;
}

export interface IDeclineInviteResponse {
  status: number;
  data: any;
  organizationId: string;
}
