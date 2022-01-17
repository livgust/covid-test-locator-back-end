import db from '../database/models';
import {Place} from '../types';
import {mapDbPlaceToPlace} from './dataMapping';

export const mergeGooglePlacesWithPlaces = async (
  googlePlaces: google.maps.places.PlaceResult[]
): Promise<Place[]> => {
  const locations: Place['location'][] = [];
  const googlePlaceIds: string[] = [];
  const mappedGooglePlaces = googlePlaces.map(
    ({geometry, name, place_id, formatted_address}) => {
      const location = {
        lat: geometry!.location!.lat as unknown as number,
        long: geometry!.location!.lng as unknown as number,
      };
      locations.push(location);
      googlePlaceIds.push(place_id!);
      return {
        location,
        name,
        googlePlaceId: place_id,
        vicinity: formatted_address,
      } as Place;
    }
  );
  const foundPlaces = await searchForPlacesWithLocationsAndGooglePlaceIds({
    locations,
    googlePlaceIds,
  });
  const foundPlaceGooglePlaceIdMap: {[key: string]: Place} = {};
  const foundPlaceLocationMap: {[key: string]: Place} = {};
  foundPlaces.forEach(foundPlace => {
    foundPlaceGooglePlaceIdMap[foundPlace.googlePlaceId] = foundPlace;
    const locationString = JSON.stringify(foundPlace.location);
    foundPlaceLocationMap[locationString] = foundPlace;
  });

  const mergedPlaces = mappedGooglePlaces.map(mappedGooglePlace => {
    const locationString = JSON.stringify(mappedGooglePlace.location);
    const foundPlace =
      foundPlaceGooglePlaceIdMap[mappedGooglePlace.googlePlaceId] ||
      foundPlaceLocationMap[locationString];
    return foundPlace || mappedGooglePlace;
  });
  return mergedPlaces;
};

export const searchForPlacesWithLocationsAndGooglePlaceIds = async ({
  locations,
  googlePlaceIds,
}: {
  locations: {lat: number; long: number}[];
  googlePlaceIds: string[];
}): Promise<Place[]> => {
  const locationsAndMap = locations.map(({lat, long}) => ({
    [db.Sequelize.Op.and]: [{latitude: lat}, {longitude: long}],
  }));
  const results = await db.Place.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        {
          googlePlaceId: googlePlaceIds,
          [db.Sequelize.Op.or]: locationsAndMap,
        },
      ],
    },
  });
  return results.map(mapDbPlaceToPlace);
};
