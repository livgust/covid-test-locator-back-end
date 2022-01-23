import {Router} from 'express';
import fetch from 'node-fetch';
import {URLSearchParams} from 'url';
import {mergeGooglePlacesWithPlaces} from '../../mappers/googlePlacesToPlaces';

const router = Router();

/** Get a list of relevant locations given a lat/long and a search string */
router.get('/searchGooglePlaces', async (req, res, next) => {
  try {
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
    const googlePlaces =
      responseJson.results as google.maps.places.PlaceResult[];
    const likelyRetailPlaces = googlePlaces.filter(
      googlePlace =>
        googlePlace.types?.includes('pharmacy') ||
        googlePlace.types?.includes('store')
    );
    const results = await mergeGooglePlacesWithPlaces(likelyRetailPlaces);
    res.json(results);
  } catch (e) {
    next(e);
  }
});

/** Takes an "address" string and returns a corresponding lat, long, and pretty string */
router.get('/geocode', async (req, res, next) => {
  try {
    const {address} = req.query as {[key: string]: string};
    const params = new URLSearchParams({
      address,
      key: process.env.GOOGLE_API_KEY as string,
    }).toString();
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseJson = (await response.json()) as any;
    console.log(responseJson);
    const firstResult = responseJson.results?.[0];
    const location = firstResult?.geometry?.location as {
      lat: number;
      lng: number;
    };
    if (!location) {
      console.error(response.json);
      throw new EvalError(`No result found for address ${address}`);
    } else {
      res.json({
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: firstResult?.formatted_address,
      });
    }
  } catch (e) {
    next(e);
  }
});

/** Takes a lat/long and returns a pretty string */
router.get('/reverseGeocode', async (req, res, next) => {
  try {
    const {latitude, longitude} = req.query as {[key: string]: string};
    const params = new URLSearchParams({
      latlng: `${latitude},${longitude}`,
      key: process.env.GOOGLE_API_KEY as string,
    }).toString();
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseJson = (await response.json()) as any;
    const addressComponents = responseJson.results[0]
      .address_components as google.maps.GeocoderAddressComponent[];
    const resultShortName = addressComponents.find(component =>
      component.types.includes('locality')
    )?.short_name;
    if (!resultShortName) {
      console.error(responseJson);
      throw new EvalError(
        `No result found for location ${JSON.stringify({latitude, longitude})}}`
      );
    } else {
      res.send(resultShortName);
    }
  } catch (e) {
    next(e);
  }
});

export default router;
