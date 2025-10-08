import { Router } from 'express';
import { createOk, createFail } from '../utils/responses.js';
import { OCR_QUEUE_NAME } from '../queue/ocrQueue.js';
import { Queue, Job } from 'bullmq';
import { bullConnection } from '../queue/connection.js';

export const uploadStatusRouter = Router();

uploadStatusRouter.get('/:jobId', async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return res.status(400).json(createFail(400, { code: 'BAD_REQUEST', message: 'jobId is required' }));
  }

  const q = new Queue(OCR_QUEUE_NAME, { connection: bullConnection });
  const job = (await Job.fromId(q, jobId)) as Job | null;
  if (!job) {
    return res.status(404).json(createFail(404, { code: 'NOT_FOUND', message: 'Job not found' }));
  }

  const state = await job.getState();
  const progress = job.progress || 0;
  const returnvalue = job.returnvalue ?? null;
  return res.status(200).json(createOk({ state, progress, result: returnvalue }));
});

