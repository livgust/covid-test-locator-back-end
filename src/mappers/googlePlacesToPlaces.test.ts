import {mergeGooglePlacesWithPlaces} from './googlePlacesToPlaces';
import db from '../database/models';

jest.mock('../database/models', () => ({
  Sequelize: {Op: {or: 'or'}},
  Place: {
    findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
  },
}));

it('returns nothing if no places are sent in ', async () => {
  expect(await mergeGooglePlacesWithPlaces([])).toEqual([]);
});

it('maps results to a Place type', async () => {
  expect(
    await mergeGooglePlacesWithPlaces([
      {
        geometry: {
          location: {
            lat: 42.4171424,
            lng: -71.160361,
          },
        },
        name: 'CVS Pharmacy',
        place_id: 'ChIJwVUXDrN344kRwnECSioprLk',
        formatted_address: '833 Massachusetts Ave, Arlington',
      } as unknown as google.maps.places.PlaceResult,
    ])
  ).toEqual([
    {
      location: {
        lat: 42.4171424,
        long: -71.160361,
      },
      name: 'CVS Pharmacy',
      googlePlaceId: 'ChIJwVUXDrN344kRwnECSioprLk',
      vicinity: '833 Massachusetts Ave, Arlington',
    },
  ]);
});

it('searches for Places with same locations or googlePlaceIds', async () => {
  await mergeGooglePlacesWithPlaces([
    {
      geometry: {
        location: {
          lat: 42.4171424,
          lng: -71.160361,
        },
      },
      name: 'CVS Pharmacy',
      place_id: 'ChIJwVUXDrN344kRwnECSioprLk',
      formatted_address: '833 Massachusetts Ave, Arlington',
    } as unknown as google.maps.places.PlaceResult,
  ]);
  expect(db.Place.findAll).toHaveBeenCalledWith({
    where: {
      or: [
        {
          googlePlaceId: {or: ['ChIJwVUXDrN344kRwnECSioprLk']},
          location: {or: [{lat: 42.4171424, long: -71.160361}]},
        },
      ],
    },
  });
});

it('merges results based on googlePlaceId', async () => {
  const mockGooglePlace = {
    geometry: {
      location: {
        lat: 42.4171424,
        lng: -71.160361,
      },
    },
    name: 'CVS Pharmacy',
    place_id: 'ChIJwVUXDrN344kRwnECSioprLk',
    vicinity: '833 Massachusetts Ave, Arlington',
  } as unknown as google.maps.places.PlaceResult;
  (db.Place.findAll as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve([
      {
        id: 100,
        googlePlaceId: 'ChIJwVUXDrN344kRwnECSioprLk',
        vicinity: '833 Massachusetts Ave, Arlington',
        name: 'CVS Pharmacy',
        latitude: 1,
        longitude: 1,
      },
    ])
  );
  expect(await mergeGooglePlacesWithPlaces([mockGooglePlace])).toEqual([
    {
      id: 100,
      googlePlaceId: 'ChIJwVUXDrN344kRwnECSioprLk',
      vicinity: '833 Massachusetts Ave, Arlington',
      name: 'CVS Pharmacy',
      location: {
        lat: 1,
        long: 1,
      },
    },
  ]);
});

it('merges results based on location', async () => {
  const mockGooglePlace = {
    geometry: {
      location: {
        lat: 42.4171424,
        lng: -71.160361,
      },
    },
    name: 'CVS Pharmacy',
    place_id: 'ChIJwVUXDrN344kRwnECSioprLk',
    vicinity: '833 Massachusetts Ave, Arlington',
  } as unknown as google.maps.places.PlaceResult;
  (db.Place.findAll as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve([
      {
        id: 100,
        googlePlaceId: 'something-else',
        latitude: 42.4171424,
        longitude: -71.160361,
        name: 'CVS store, not pharmacy',
        vicinity: '833 Massachusetts Ave, Arlington',
      },
    ])
  );
  expect(await mergeGooglePlacesWithPlaces([mockGooglePlace])).toEqual([
    {
      id: 100,
      googlePlaceId: 'something-else',
      vicinity: '833 Massachusetts Ave, Arlington',
      name: 'CVS store, not pharmacy',
      location: {
        lat: 42.4171424,
        long: -71.160361,
      },
    },
  ]);
});

it('leaves an unmatched place alone', async () => {
  const mockGooglePlace = {
    geometry: {
      location: {
        lat: 42.4171424,
        lng: -71.160361,
      },
    },
    name: 'CVS Pharmacy',
    place_id: 'ChIJwVUXDrN344kRwnECSioprLk',
    formatted_address: '833 Massachusetts Ave, Arlington',
  } as unknown as google.maps.places.PlaceResult;
  expect(await mergeGooglePlacesWithPlaces([mockGooglePlace])).toEqual([
    {
      googlePlaceId: 'ChIJwVUXDrN344kRwnECSioprLk',
      vicinity: '833 Massachusetts Ave, Arlington',
      name: 'CVS Pharmacy',
      location: {
        lat: 42.4171424,
        long: -71.160361,
      },
    },
  ]);
});
