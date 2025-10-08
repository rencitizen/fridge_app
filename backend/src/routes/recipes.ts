import { Router } from 'express';
import { createOk, createFail } from '../utils/responses.js';
import { z } from 'zod';
import axios from 'axios';
import { env } from '../config/env.js';

export const recipesRouter = Router();

const suggestSchema = z.object({
  ingredients: z.string().optional(), // comma-separated
});

recipesRouter.get('/suggest', async (req, res) => {
  try {
    const { ingredients } = suggestSchema.parse(req.query);
    const list = ingredients
      ? ingredients
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    if (!env.geminiApiKey) {
      return res.status(500).json(createFail(500, { code: 'GEMINI_CONFIG_MISSING', message: 'Gemini API key missing' }));
    }

    const prompt =
      list.length > 0
        ? `Suggest 3 simple recipes using only: ${list.join(', ')}. Reply as JSON array with {title, ingredients, steps}.`
        : 'Suggest 3 simple dinner recipes. Reply as JSON array with {title, ingredients, steps}.';

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    const { data } = await axios.post(
      `${url}?key=${encodeURIComponent(env.geminiApiKey)}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
    let recipes: unknown = [];
    try {
      recipes = JSON.parse(text);
    } catch {
      // fall back to plain text when JSON parse fails
      recipes = [{ title: 'AI Suggestion', ingredients: [], steps: [text] }];
    }

    return res.status(200).json(createOk({ recipes }));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get suggestions';
    return res.status(500).json(createFail(500, { code: 'GEMINI_ERROR', message }));
  }
});
