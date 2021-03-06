import {DbPlaceWithGetter, DbReport, Report} from '../types';
import {
  mapDbPlaceToPlace,
  mapDbReportToReport,
  mapDbValidationToValidation,
  mapPlaceToDbPlace,
  mapReportToDbReport,
} from './dataMapping';

describe('maps DB reports to Reports', () => {
  test('basic example', () => {
    const exampleDbReport = {
      id: 1,
      placeId: 2,
      available: true,
      type: 'PCR test',
      limit: 2,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
    } as DbReport;
    expect(mapDbReportToReport(exampleDbReport)).toEqual({
      id: 1,
      placeId: 2,
      available: true,
      type: 'PCR test',
      limit: 2,
      created: 'this-is-a-date-string',
    });
  });

  it('maps null limit to undefined', () => {
    const exampleDbReport = {
      id: 1,
      placeId: 2,
      available: false,
      type: 'PCR test',
      limit: null,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
    } as DbReport;
    expect(mapDbReportToReport(exampleDbReport)).toEqual({
      id: 1,
      placeId: 2,
      available: false,
      type: 'PCR test',
      limit: undefined,
      created: 'this-is-a-date-string',
    });
  });
  it('uses reportedAt for precedence', () => {
    const exampleDbReport = {
      id: 1,
      placeId: 2,
      available: true,
      type: 'PCR test',
      limit: 2,
      reportedAt: 'reported-datetime',
      createdAt: 'created-datetime',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
    } as DbReport;
    expect(mapDbReportToReport(exampleDbReport)).toEqual({
      id: 1,
      placeId: 2,
      available: true,
      type: 'PCR test',
      limit: 2,
      created: 'reported-datetime',
    });
  });
});

describe('maps DB places to Places', () => {
  test('basic example', () => {
    const exampleDbPlace = {
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      latitude: 100,
      longitude: 100,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
      get: () => {},
    } as DbPlaceWithGetter;
    expect(mapDbPlaceToPlace(exampleDbPlace)).toEqual({
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      location: {
        lat: 100,
        long: 100,
      },
    });
  });

  it('maps reports', () => {
    const exampleDbPlace = {
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      latitude: 100,
      longitude: 100,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
      get: () => {},
      Reports: [
        {
          id: 1,
          placeId: 2,
          available: true,
          type: 'PCR test',
          limit: 2,
          createdAt: 'this-is-a-date-string',
          createdBy: 'some-user',
          updatedAt: 'this-is-a-date-string',
        },
      ],
    } as DbPlaceWithGetter;
    expect(mapDbPlaceToPlace(exampleDbPlace)).toEqual({
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      location: {
        lat: 100,
        long: 100,
      },
      reports: [
        {
          id: 1,
          placeId: 2,
          available: true,
          type: 'PCR test',
          limit: 2,
          created: 'this-is-a-date-string',
        },
      ],
    });
  });

  it('optionally adds distance', () => {
    const exampleDbPlace = {
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      latitude: 100,
      longitude: 100,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
      get: field => {
        if (field === 'distance') {
          return 1.5;
        } else return;
      },
    } as DbPlaceWithGetter;
    expect(mapDbPlaceToPlace(exampleDbPlace)).toEqual({
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      location: {
        lat: 100,
        long: 100,
      },
      distance: 1.5,
    });
  });

  it('optionally adds website and phone number', () => {
    const exampleDbPlace = {
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      latitude: 100,
      longitude: 100,
      createdAt: 'this-is-a-date-string',
      createdBy: 'some-user',
      updatedAt: 'this-is-a-date-string',
      website: 'www.google.com',
      phoneNumber: '(857) 867-5309',
      get: () => {},
    } as DbPlaceWithGetter;
    expect(mapDbPlaceToPlace(exampleDbPlace)).toEqual({
      id: 1,
      googlePlaceId: 'ABC_123',
      name: 'Test Pharmacy',
      vicinity: '123 Easy Street',
      location: {
        lat: 100,
        long: 100,
      },
      website: 'www.google.com',
      phoneNumber: '(857) 867-5309',
    });
  });
});

describe('maps Place to DbPlace', () => {
  it('does basic mapping', () => {
    const examplePlace = {
      googlePlaceId: 'ABC_DEF',
      name: 'Example Place',
      vicinity: '123 Easy St',
      location: {
        lat: 100,
        long: 100,
      },
    };
    expect(mapPlaceToDbPlace(examplePlace)).toEqual({
      googlePlaceId: 'ABC_DEF',
      name: 'Example Place',
      vicinity: '123 Easy St',
      latitude: 100,
      longitude: 100,
    });
  });
  it('adds ID if it exists', () => {
    const examplePlace = {
      id: 1,
      googlePlaceId: 'ABC_DEF',
      name: 'Example Place',
      vicinity: '123 Easy St',
      location: {
        lat: 100,
        long: 100,
      },
    };
    expect(mapPlaceToDbPlace(examplePlace)).toEqual({
      id: 1,
      googlePlaceId: 'ABC_DEF',
      name: 'Example Place',
      vicinity: '123 Easy St',
      latitude: 100,
      longitude: 100,
    });
  });
});

describe('maps report to db report', () => {
  it('maps required fields', () => {
    const exampleReport = {
      placeId: 1,
      available: false,
      type: 'PCR test',
    } as Report;
    expect(mapReportToDbReport(exampleReport)).toEqual({
      placeId: 1,
      available: false,
      limit: null,
      type: 'PCR test',
    });
  });
  it('maps optional fields', () => {
    const exampleReport = {
      placeId: 1,
      available: true,
      type: 'PCR test',
      limit: 0,
      created: 'this-is-a-timestamp',
    } as Report;
    expect(mapReportToDbReport(exampleReport)).toEqual({
      placeId: 1,
      available: true,
      limit: 0,
      type: 'PCR test',
      reportedAt: 'this-is-a-timestamp',
    });
  });
});

describe('validation mapping', () => {
  it('removes updatedAt and moves createdAt to created', () => {
    expect(
      mapDbValidationToValidation({
        id: 1,
        reportId: 2,
        createdBy: 'user',
        createdAt: 'time1',
        updatedAt: 'time2',
      })
    ).toEqual({
      id: 1,
      reportId: 2,
      createdBy: 'user',
      created: 'time1',
    });
  });
});
