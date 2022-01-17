export type Place = {
  id?: number;
  googlePlaceId: string;
  name: string;
  vicinity: string;
  location: {
    lat: number;
    long: number;
  };
  reports?: Report[];
};

export type DbPlace = {
  id?: number;
  googlePlaceId: string;
  name: string;
  vicinity: string;
  latitude: number;
  longitude: number;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  Reports?: DbReport[];
};

/**
 * Reported Covid test availability for a location. id and created are only
 * populated for Reports retrieved from the server, not ones requested to be created.
 */
export type Report = {
  id?: number;
  placeId: number;
  created?: string;
  available: boolean;
  type:
    | 'at-home rapid antigen test'
    | 'rapid antigen test'
    | 'rapid PCR test'
    | 'PCR test';
  validations?: ReportValidation[];
  limit?: number;
  quantity?: 'S' | 'M' | 'L' | 'XL';
};

export type DbReport = {
  id?: number;
  placeId: number;
  available: boolean;
  type:
    | 'at-home rapid antigen test'
    | 'rapid antigen test'
    | 'rapid PCR test'
    | 'PCR test';
  limit: number | null;
  createdBy?: string | null;
  createdAt?: string;
  reportedAt?: string;
  updatedAt?: string;
  ReportValidations?: DbReportValidation[];
};

export type ReportValidation = {
  id?: number;
  reportId: number;
  created?: string;
  createdBy?: string;
};

export type DbReportValidation = {
  id?: number;
  reportId: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};
