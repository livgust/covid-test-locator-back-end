import {ReportValidation} from '../../types';
import {validateAndFormatPostRequest} from '../reportValidations';

it('checks that report ID exists', () => {
  expect(() =>
    validateAndFormatPostRequest({}, {} as ReportValidation)
  ).toThrow(ReferenceError);
});

it('adds report ID to the result if the body does not have a reportId', () => {
  expect(
    validateAndFormatPostRequest({reportId: '1'}, {} as ReportValidation)
  ).toEqual({
    reportId: 1,
  });
});

it('checks that the report IDs are equal', () => {
  expect(() =>
    validateAndFormatPostRequest({reportId: '1'}, {
      reportId: 2,
    } as ReportValidation)
  ).toThrow(RangeError);
});
