import { Queue, QueueEvents, JobsOptions } from 'bullmq';
import { bullConnection } from './connection.js';

export type OcrJobPayload = {
  gcsUri: string;
  userId?: string;
};

export const OCR_QUEUE_NAME = 'ocr-jobs';

export const ocrQueue = new Queue<OcrJobPayload>(OCR_QUEUE_NAME, {
  connection: bullConnection,
});

export const ocrQueueEvents = new QueueEvents(OCR_QUEUE_NAME, {
  connection: bullConnection,
});

export async function enqueueOcrJob(payload: OcrJobPayload, options?: JobsOptions) {
  const job = await ocrQueue.add('ocr', payload, options);
  return job;
}

