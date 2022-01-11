import {Router} from 'express';

const router = Router();

router.use('/searchGooglePlaces', (req, res) => {
  // get locations from Google
  // then supplement with our own IDs where we can
  res.json([]);
});

export default router;
