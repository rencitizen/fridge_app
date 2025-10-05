import { Router } from 'express';
import { createOk } from '../utils/responses.js';

export const uploadRouter = Router();

uploadRouter.post('/', async (_req, res) => {
  // TODO: enqueue OCR job, return jobId
  return res.status(202).json(createOk({ jobId: 'todo' }));
});
