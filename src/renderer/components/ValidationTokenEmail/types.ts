export interface IValidationTokenEmailProps {
  type: 'register' | 'login';
  savePrivateKey?: boolean;
  handleSetIsLoading: (loading: boolean) => void;
}

export interface IValidationTokenEmail {
  token: string;
}
