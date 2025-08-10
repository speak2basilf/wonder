import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';
import axios from 'axios';

export const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM leads WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { contact_id, source, status, owner_id, expected_value } = req.body;
    const result = await query(
      'INSERT INTO leads(organization_id, contact_id, source, status, owner_id, expected_value) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [org, contact_id, source, status || 'new', owner_id, expected_value]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});

router.post('/:id/score', async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const { rows } = await query('SELECT * FROM leads WHERE id=$1', [leadId]);
    const lead = rows[0];
    const aiUrl = process.env.AI_LEAD_SCORING_URL || 'http://ai-lead-scoring:9001/predict';
    const { data } = await axios.post(aiUrl, { lead });
    await query('UPDATE leads SET score=$1, score_explanation=$2 WHERE id=$3', [data.score, data.explanation, leadId]);
    res.json({ score: data.score, explanation: data.explanation });
  } catch (e) { next(e); }
});