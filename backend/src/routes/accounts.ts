import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';

export const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM accounts WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { name, industry, website } = req.body;
    const result = await query(
      'INSERT INTO accounts(organization_id, name, industry, website) VALUES($1,$2,$3,$4) RETURNING *',
      [org, name, industry, website]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});