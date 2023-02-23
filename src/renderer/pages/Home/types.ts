export interface IHomeProps {
  isLoading: boolean;
  handleSetIsLoading: (loading: boolean) => void;
  handleRefreshTime: (newTime: number) => void;
}

export interface ISelectedOrganization {
  email: string;
  organizationId: string;
}

export interface ISearchKeyProps {
  handleEnter: () => void;
  verifiedSafetyPhrase: boolean;
  handleSafetyPhrase: (phrase: boolean) => void;
  handleSetIsLoading: (loading: boolean) => void;
  handleIsValidPrivateKey: (pub: boolean) => void;
  handleVerifiedSafetyPhrase: (verified: boolean) => void;
}
