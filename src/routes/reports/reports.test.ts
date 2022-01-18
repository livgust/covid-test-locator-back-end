import {Report} from '../../types';
import {validateAndFormatPostRequest} from '../reports';

describe('validateAndFormatPostRequest', () => {
  it('verifies that a report ID exists', () => {
    expect(() => validateAndFormatPostRequest({}, {} as Report)).toThrow(
      ReferenceError
    );
  });

  it('verifies that report ID param = report ID from body', () => {
    expect(() =>
      validateAndFormatPostRequest({placeId: '1'}, {placeId: 2} as Report)
    ).toThrow(RangeError);
  });

  it("applies param placeId to body if body's placeId doesn't exist", () => {
    expect(
      validateAndFormatPostRequest({placeId: '1'}, {} as Report).placeId
    ).toEqual(1);
  });
});
