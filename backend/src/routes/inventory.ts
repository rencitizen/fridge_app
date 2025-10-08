import { Router } from 'express';
import { createOk } from '../utils/responses.js';
import { db } from '../config/firebase.js';

export const inventoryRouter = Router();

inventoryRouter.get('/', async (_req, res) => {
  const snapshot = await db().collection('inventory').get();
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return res.status(200).json(createOk({ items }));
});
