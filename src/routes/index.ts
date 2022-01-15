import {Router} from 'express';
import googlePassThrough from './googlePassThrough';
import placesRouter from './places';

const router = Router();

router.use(googlePassThrough);
router.use(placesRouter);

router.use('/health', (req, res) => {
  res.send(200);
});

export default router;
