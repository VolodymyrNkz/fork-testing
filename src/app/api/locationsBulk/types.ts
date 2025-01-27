export interface LocationsBulkBody {
  locations: string[];
}

export interface Location {
  reference: string;
  provider: string;
  name: string;
  unstructuredAddress?: string;
  address?: {
    street: string;
    country: string;
  };
  providerReference: string;
}

export interface LocationsBulkResponse {
  locations: Location[];
}
