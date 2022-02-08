import {Router} from 'express';
import reportRouter from '../reports';
import db from '../../database/models';
import fetch from 'node-fetch';
import {DbPlaceWithGetter, Place} from '../../types';
import {mapDbPlaceToPlace, mapPlaceToDbPlace} from '../../mappers/dataMapping';
import {URLSearchParams} from 'url';

const router = Router();

const haversineFormula = (latitude: string, longitude: string) =>
  db.sequelize.literal(
    '3959 * acos(cos(radians(' +
      latitude +
      ')) * cos(radians(latitude)) * cos(radians(' +
      longitude +
      ') - radians(longitude)) + sin(radians(' +
      latitude +
      ')) * sin(radians(latitude)))'
  );
/**
 * Get the closest 50 places, ordered by distance (nearest first)
 */
router.get('/places', async (req, res, next) => {
  const {latitude, longitude} = req.query as {[key: string]: string};
  try {
    //https://stackoverflow.com/questions/44012932/sequelize-geospatial-query-find-n-closest-points-to-a-location/46438100#46438100
    const dbPlaces = (await db.Place.findAll({
      include: [
        {
          model: db.Report,
          include: db.ReportValidation,
        },
      ],
      attributes: {
        include: [
          [
            haversineFormula(latitude, longitude),
            'distance', // in miles
          ],
        ],
      },
      where: db.sequelize.where(haversineFormula(latitude, longitude), {
        [db.Sequelize.Op.lt]: 50,
      }),
      order: db.sequelize.col('distance'),
    })) as DbPlaceWithGetter[];
    const places = dbPlaces.map(mapDbPlaceToPlace);
    res.json(places);
  } catch (e) {
    next(e);
  }
});

router.post('/places', async (req, res, next) => {
  try {
    const place = await formatPlaceForSave(req.body as Place);
    const newPlace = await db.Place.create(mapPlaceToDbPlace(place));
    res.json(newPlace);
  } catch (e) {
    next(e);
  }
});

router.get('/online-retailers', async (req, res, next) => {
  try {
    const response = await fetch(
      'https://covid-test-api.us-east-1.linodeobjects.com/export.json'
    );
    const responseJson = await response.json();
    res.json(responseJson);
  } catch (e) {
    next(e);
  }
});

export const formatPlaceForSave = async (place: Place): Promise<Place> => {
  const augmentativeData = await getAugmentativeGooglePlaceData(
    place.googlePlaceId
  );
  return {...place, ...augmentativeData};
};

export const getAugmentativeGooglePlaceData = async (
  googlePlaceId: string
): Promise<{phoneNumber?: string; website?: string}> => {
  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY as string,
    place_id: googlePlaceId,
    fields: 'formatted_phone_number,website',
  }).toString();
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseJson = (await response.json())
    .result as google.maps.places.PlaceResult;
  return {
    phoneNumber: responseJson.formatted_phone_number,
    website: responseJson.website,
  };
};

router.use('/places/:placeId', reportRouter);

export default router;
