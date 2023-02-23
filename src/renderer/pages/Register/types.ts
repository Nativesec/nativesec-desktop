export interface ICreateUserResponse {
  status: number;
  data: {
    status: string;
    msg: string;
  };
}

export interface IRegisterSchema {
  name: string;
  email: string;
  safetyPhrase: string;
  confirmSafetyPhrase: string;
  savePrivateKey: boolean;
}
