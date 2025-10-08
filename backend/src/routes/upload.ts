import { Router, Request, Response } from 'express';
import { createOk, createFail } from '../utils/responses.js';
import { storage } from '../config/firebase.js';
import { enqueueOcrJob } from '../queue/ocrQueue.js';
import { generateId } from '../utils/id.js';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';

export const uploadRouter = Router();

const uploadSchema = z.object({
  imageBase64: z.string().min(1),
  filename: z.string().optional(),
  userId: z.string().optional(),
});

uploadRouter.post('/', validateBody(uploadSchema), async (req: Request, res: Response) => {
  try {
    const { imageBase64, filename, userId } = req.body as z.infer<typeof uploadSchema>;

    if (!imageBase64) {
      return res.status(400).json(createFail(400, { code: 'BAD_REQUEST', message: 'imageBase64 is required' }));
    }

    const name = filename || `${generateId('upload')}.jpg`;
    const bucket = storage();
    const file = bucket.file(name);
    const buffer = Buffer.from(imageBase64, 'base64');
    await file.save(buffer, { contentType: 'image/jpeg', resumable: false, public: false });
    const gcsUri = `gs://${bucket.name}/${name}`;

    const job = await enqueueOcrJob({ gcsUri, userId });

    return res.status(202).json(createOk({ jobId: job.id, gcsUri }));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(500).json(createFail(500, { code: 'UPLOAD_FAILED', message }));
  }
});
