
export interface SafetyPhraseProps {
  handleSafetyPhrase: (phrase: boolean) => void;
  handleSetIsLoading: (loading: boolean) => void;
  handleVerifiedSafetyPhrase: (verified: boolean) => void;
  handleEnter: () => void;
  verifiedSafetyPhrase: boolean;
}
