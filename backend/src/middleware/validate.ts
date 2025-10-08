import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { createFail } from '../utils/responses.js';

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (e) {
      const err = e as ZodError;
      return res.status(400).json(
        createFail(400, { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: err.issues }),
      );
    }
  };
}

