import { Router } from 'express';
import { createOk } from '../utils/responses.js';

export const inventoryRouter = Router();

inventoryRouter.get('/', async (_req, res) => {
  // TODO: fetch from Firestore
  return res.status(200).json(createOk({ items: [] }));
});
