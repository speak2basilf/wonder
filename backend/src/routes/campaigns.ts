import { Router } from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { query } from '../db/pool.js';
import axios from 'axios';

export const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM campaigns WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', requireRoles('marketing','admin'), async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { name, channel, content, schedule_at } = req.body;
    const result = await query(
      'INSERT INTO campaigns(organization_id, name, channel, content, schedule_at) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [org, name, channel, content, schedule_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});

router.post('/generate', requireRoles('marketing','admin'), async (req, res, next) => {
  try {
    const { prompt } = req.body as { prompt: string };
    const nlpUrl = process.env.AI_NLP_URL || 'http://ai-nlp:9004/generate';
    const { data } = await axios.post(nlpUrl, { prompt });
    res.json({ content: data.content });
  } catch (e) { next(e); }
});