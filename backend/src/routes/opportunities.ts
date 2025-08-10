import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';

export const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM opportunities WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { lead_id, stage_id, amount, close_date, probability, owner_id } = req.body;
    const result = await query(
      'INSERT INTO opportunities(organization_id, lead_id, stage_id, amount, close_date, probability, owner_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [org, lead_id, stage_id, amount, close_date, probability, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});

router.post('/:id/move', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { stage_id } = req.body;
    await query('UPDATE opportunities SET stage_id=$1 WHERE id=$2', [stage_id, id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});