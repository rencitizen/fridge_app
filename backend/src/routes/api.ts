import { Router } from 'express';
import { inventoryRouter } from './inventory.js';
import { uploadRouter } from './upload.js';
import { recipesRouter } from './recipes.js';
import { uploadStatusRouter } from './uploadStatus.js';

export const apiRouter = Router();

apiRouter.use('/inventory', inventoryRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/upload/status', uploadStatusRouter);
apiRouter.use('/recipes', recipesRouter);
