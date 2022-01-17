import {Router} from 'express';
import reportRouter from './reports/';
import db from '../database/models';
import {DbPlace, Place} from '../types';
import {mapDbPlaceToPlace, mapPlaceToDbPlace} from '../mappers/dataMapping';

const router = Router();

router.get('/places', async (req, res, next) => {
  try {
    //https://stackoverflow.com/questions/44012932/sequelize-geospatial-query-find-n-closest-points-to-a-location/46438100#46438100
    const dbPlaces = (await db.Place.findAll({
      include: [
        {
          model: db.Report,
          include: db.ReportValidation,
        },
      ],
    })) as DbPlace[];
    const places = dbPlaces.map(mapDbPlaceToPlace);
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
