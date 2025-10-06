import { Router } from 'express';
import { inventoryRouter } from './inventory.js';
import { uploadRouter } from './upload.js';
import { recipesRouter } from './recipes.js';

export const apiRouter = Router();

apiRouter.use('/inventory', inventoryRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/recipes', recipesRouter);
