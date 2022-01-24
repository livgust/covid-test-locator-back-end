/* eslint-disable @typescript-eslint/no-explicit-any */
import {QueryInterface, DataTypes} from 'sequelize';
import {getAugmentativeGooglePlaceData} from '../../routes/places';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async ({context}: {context: any}) => {
  const queryInterface =
    context.sequelize.getQueryInterface() as QueryInterface;
  await queryInterface.addColumn('places', 'phone_number', DataTypes.STRING);
  await queryInterface.addColumn('places', 'website', DataTypes.STRING);

  //backfill
  const existingPlaces = await context.Place.findAll();
  const promiseArray: Promise<any>[] = [];
  existingPlaces.forEach(async (place: any) => {
    promiseArray.push(
      getAugmentativeGooglePlaceData(place.googlePlaceId).then(
        ({website, phoneNumber}) => {
          console.log({website, phoneNumber});
          return place.update({website, phoneNumber});
        }
      )
    );
  });
  return await Promise.all(promiseArray);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async ({context}: {context: any}) => {
  const queryInterface = context.getQueryInterface() as QueryInterface;
  await queryInterface.removeColumn('places', 'phoneNumber');
  await queryInterface.removeColumn('places', 'website');
};
