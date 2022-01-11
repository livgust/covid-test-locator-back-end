import {Router} from 'express';
import reportValidationsRouter from './reportValidations';

const router = Router({mergeParams: true});

router.post('/', (req, res) => {
  // save report - place is in req.params.placeId
  res.json({});
});

router.use('/:reportId/reportValidations', reportValidationsRouter);

export default router;
