import {Router} from 'express';

const router = Router({mergeParams: true});

router.post('/', (req, res) => {
  // save validation - report is req.params.reportId
  res.json({});
});

export default router;
