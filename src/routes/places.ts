import {Router} from 'express';
import reportRouter from './reports';
import db from '../database/models';
import {Place} from '../types';

const router = Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', async (req, res) => {
  // save new place
  const {googlePlaceId, name, vicinity, location} = req.body as Place;
  const newPlace = await db.Place.create({
    googlePlaceId,
    name,
    vicinity,
    location,
  });
  // send new place with ID
  res.json(newPlace);
});

router.use('/:placeId/reports', reportRouter);

export default router;
