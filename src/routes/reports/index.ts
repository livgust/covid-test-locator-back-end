import {Router} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import db from '../../database/models';
import {Report} from '../../types';
import reportValidationsRouter from '../reportValidations';

const router = Router({mergeParams: true});

router.post('/', async (req, res) => {
  const reportToSave = validateAndFormatPostRequest(
    req.params,
    req.body as Report
  );

  const savedReport = await db.Report.create(reportToSave);

  res.json(savedReport);
});

router.use('/:reportId/reportValidations', reportValidationsRouter);

export function validateAndFormatPostRequest(
  params: ParamsDictionary,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: Report
) {
  const returnReport = {...report};
  if (!params.placeId) {
    throw new ReferenceError('placeId required when referencing a report');
  }

  if (!report.placeId) {
    returnReport.placeId = parseInt(params.placeId);
  } else if (parseInt(params.placeId) !== report.placeId) {
    throw new RangeError('placeId in params must equal placeId in body');
  }

  return returnReport;
}

export default router;
