import {Router} from 'express';
import reportRouter from './reports/';
import db from '../database/models';
import {DbPlaceWithGetter, Place} from '../types';
import {mapDbPlaceToPlace, mapPlaceToDbPlace} from '../mappers/dataMapping';

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
    console.log(db.Pl);
    const places = dbPlaces.map(mapDbPlaceToPlace);
    console.log(places);
    res.json(places);
  } catch (e) {
    next(e);
  }
});

router.post('/places', async (req, res, next) => {
  try {
    const place = req.body as Place;
    const newPlace = await db.Place.create(mapPlaceToDbPlace(place));
    res.json(newPlace);
  } catch (e) {
    next(e);
  }
});

router.use('/places/:placeId', reportRouter);

export default router;
