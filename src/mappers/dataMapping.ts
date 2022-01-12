import {
  DbPlace,
  DbReport,
  DbReportValidation,
  Place,
  Report,
  ReportValidation,
} from '../types';

export const mapDbReportToReport = (dbReport: DbReport): Report => {
  const {id, placeId, available, type, limit, createdAt, ReportValidations} =
    dbReport;
  return {
    id,
    placeId,
    available,
    type,
    limit: limit === null ? undefined : limit,
    created: createdAt,
    validations: ReportValidations?.map(mapDbValidationToValidation),
  };
};

export const mapReportToDbReport = (report: Report): DbReport => {
  const {id, placeId, created, available, type, limit, validations} = report;
  const dbReport = {
    id,
    placeId,
    available,
    type,
    limit: limit !== undefined ? limit : null,
    createdAt: created,
    ReportValidations: validations?.map(mapValidationToDbValidation),
  };
  return dbReport;
};

export const mapDbPlaceToPlace = (dbPlace: DbPlace): Place => {
  const {id, googlePlaceId, name, vicinity, location, Reports} = dbPlace;
  return {
    id,
    googlePlaceId,
    name,
    vicinity,
    location,
    reports: Reports?.map(mapDbReportToReport),
  };
};

export const mapPlaceToDbPlace = (place: Place): DbPlace => {
  const {id, googlePlaceId, name, vicinity, location} = place;
  const dbPlace = {
    id,
    googlePlaceId,
    name,
    vicinity,
    location,
  };
  return dbPlace;
};

export const mapDbValidationToValidation = (
  dbValidation: DbReportValidation
): ReportValidation => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {updatedAt, createdAt, reportId, id, createdBy} = dbValidation;
  return {
    id,
    reportId,
    createdBy,
    created: createdAt,
  };
};

export const mapValidationToDbValidation = (
  validation: ReportValidation
): DbReportValidation => {
  return validation as DbReportValidation;
};
