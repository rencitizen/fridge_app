import { Router } from 'express';
import { createOk } from '../utils/responses.js';

export const recipesRouter = Router();

recipesRouter.get('/suggest', async (_req, res) => {
  // TODO: call Gemini for suggestions
  return res.status(200).json(createOk({ recipes: [] }));
});
