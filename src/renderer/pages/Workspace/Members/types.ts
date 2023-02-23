export interface IDeleteInviteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  orgId: string;
  user:
    | {
        email: string;
        type: 'participant' | 'admin';
      }
    | undefined;
  currentTheme: 'light' | 'dark' | '';
}

export interface IInviteMemberModalProps {
  isOpen: boolean;
  onRequestClose(): void;
  orgId: string | undefined;
  currentTheme: 'light' | 'dark' | '';
}

export interface IGetAllOrganizationHandleOrganization {
  type: string;
}
