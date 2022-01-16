import {Router} from 'express';
import fetch from 'node-fetch';
import {URLSearchParams} from 'url';
import {mergeGooglePlacesWithPlaces} from '../../mappers/googlePlacesToPlaces';

const router = Router();

router.use('/searchGooglePlaces', async (req, res) => {
  console.log(req);
  const {location, keyword} = req.query as {[key: string]: string};
  // get locations from Google
  const params = new URLSearchParams({
    location,
    input: keyword,
    key: process.env.GOOGLE_API_KEY as string,
    radius: '50000', // radius isn't _supposed_ to be required but evidently it is, in practice
  }).toString();
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseJson = (await response.json()) as any;
  // TODO: log if status is not OK
  const googlePlaces = responseJson.results as google.maps.places.PlaceResult[];
  const results = await mergeGooglePlacesWithPlaces(googlePlaces);
  res.json(results);
});

export default router;
