export interface GooglePlaceResponse {
  id: string;
  formattedAddress: string;
  displayName: {
    text: string;
    languageCode?: string;
  };
}
