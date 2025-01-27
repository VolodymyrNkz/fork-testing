export interface Destination {
  destinationId: number;
  name: string;
  type: string;
  parentDestinationId: number;
  lookupId: string;
  destinationUrl?: string;
}

export interface DestinationsResponse {
  destinations: Destination[];
  totalCount: number;
}

export interface MappedDestinations {
  destinations: Record<string, Destination>;
  totalCount: DestinationsResponse['totalCount'];
}
