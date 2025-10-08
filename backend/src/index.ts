import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api.js';
import { createOk, createFail } from './utils/responses.js';
import { env, getCorsOriginOption } from './config/env.js';
import { initializeFirebaseIfNeeded } from './config/firebase.js';
import { startOcrWorker } from './workers/ocrWorker.js';

initializeFirebaseIfNeeded();
startOcrWorker();

const app = express();
app.use(cors({ origin: getCorsOriginOption() }));
app.use(express.json({ limit: '5mb' }));

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json(createOk({ status: 'ok' }));
});

app.use('/api', apiRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  return res.status(404).json(createFail(404, { code: 'NOT_FOUND', message: 'Route not found' }));
});

// error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return res
    .status(500)
    .json(createFail(500, { code: 'INTERNAL_ERROR', message: err.message || 'Internal Server Error' }));
});

const port = env.port;
app.listen(port, () => {
  console.log(`PantrySync backend listening on :${port}`);
});
