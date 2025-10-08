import { Worker, Job } from 'bullmq';
import { bullConnection } from '../queue/connection.js';
import { OCR_QUEUE_NAME, OcrJobPayload } from '../queue/ocrQueue.js';
import vision from '@google-cloud/vision';
import { db } from '../config/firebase.js';

export function startOcrWorker() {
  const client = new vision.ImageAnnotatorClient();

  const worker = new Worker<OcrJobPayload>(
    OCR_QUEUE_NAME,
    async (job: Job<OcrJobPayload>) => {
      const { gcsUri, userId } = job.data;
      job.updateProgress(10);

      const [result] = await client.textDetection(gcsUri);
      job.updateProgress(70);
      const detections = result.textAnnotations || [];
      const fullText = detections[0]?.description ?? '';

      const docRef = db().collection('ocr_results').doc(job.id as string);
      await docRef.set({ gcsUri, userId: userId ?? null, text: fullText, createdAt: new Date().toISOString() });

      job.updateProgress(100);
      return { text: fullText };
    },
    { connection: bullConnection },
  );

  worker.on('failed', (job, err) => {
    console.error('OCR job failed', job?.id, err);
  });

  return worker;
}

