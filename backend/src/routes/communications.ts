import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';
import axios from 'axios';

export const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM communications WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { channel, direction, participant_contact_id, participant_user_id, subject, content, metadata } = req.body;
    const aiUrl = process.env.AI_SENTIMENT_URL || 'http://ai-sentiment:9002/analyze';
    const { data } = await axios.post(aiUrl, { text: content });
    const result = await query(
      'INSERT INTO communications(organization_id, channel, direction, participant_contact_id, participant_user_id, subject, content, sentiment, sentiment_score, metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [org, channel, direction, participant_contact_id, participant_user_id, subject, content, data.label, data.score, metadata]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});