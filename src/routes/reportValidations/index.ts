import {Router} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import db from '../../database/models';
import {ReportValidation} from '../../types';

const router = Router({mergeParams: true});

router.post('/reportValidations', async (req, res) => {
  const requestValidation = validateAndFormatPostRequest(
    req.params,
    req.body as ReportValidation
  );

  const addedValidation = await db.ReportValidation.create(requestValidation);
  res.json(addedValidation);
});

export function validateAndFormatPostRequest(
  params: ParamsDictionary,
  reportValidation: ReportValidation
) {
  const resultReportValidation = {...reportValidation};
  if (!params.reportId) {
    throw new ReferenceError(
      'must have a report ID to save a report validation'
    );
  }

  if (!reportValidation.reportId) {
    resultReportValidation.reportId = parseInt(params.reportId);
  } else if (reportValidation.reportId !== parseInt(params.reportId)) {
    throw new RangeError('param reportId must equal body reportId');
  }

  return resultReportValidation;
}

export default router;
