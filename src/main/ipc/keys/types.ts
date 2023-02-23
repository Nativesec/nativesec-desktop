export interface IGetLocalPrivateKey {
  data: any;
  email: string;
  full_name: string;
  private_key: string;
  workspaceId: string;
  type: string;
}

export interface IInsertPrivateKey {
  privateKey: string;
}
