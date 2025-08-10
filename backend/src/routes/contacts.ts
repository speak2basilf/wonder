import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';

export const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const result = await query('SELECT * FROM contacts WHERE organization_id=$1 ORDER BY created_at DESC', [org]);
    res.json(result.rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const { account_id, email, phone, first_name, last_name, title, tags } = req.body;
    const result = await query(
      'INSERT INTO contacts(organization_id, account_id, email, phone, first_name, last_name, title, tags) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [org, account_id, email, phone, first_name, last_name, title, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});