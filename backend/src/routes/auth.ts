import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { issueAccessToken, issueRefreshToken } from '../utils/jwt.js';

export const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { rows } = await query<{ id: string; password_hash: string; organization_id: string }>(
      'SELECT id, password_hash, organization_id FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });

    const rolesRes = await query<{ name: string }>('SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1', [user.id]);
    const roles = rolesRes.rows.map(r => r.name);

    const access = issueAccessToken({ id: user.id, organizationId: user.organization_id, roles });
    const refresh = issueRefreshToken(user.id);
    await query('INSERT INTO refresh_tokens(token, user_id, expires_at) VALUES($1,$2, now() + interval \'30 days\')', [refresh, user.id]);

    res.json({ accessToken: access, refreshToken: refresh, roles });
  } catch (e) { next(e); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    const row = await query<{ token: string; user_id: string }>('SELECT token, user_id FROM refresh_tokens WHERE token=$1', [refreshToken]);
    if (!row.rows[0]) return res.status(401).json({ error: { message: 'Invalid refresh token' } });
    // For brevity we do not verify crypto signature here; in prod verify JWT signature
    const userId = row.rows[0].user_id;
    const userRes = await query<{ id: string; organization_id: string }>('SELECT id, organization_id FROM users WHERE id=$1', [userId]);
    const rolesRes = await query<{ name: string }>('SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1', [userId]);
    const user = userRes.rows[0];
    const roles = rolesRes.rows.map(r => r.name);
    const access = issueAccessToken({ id: user.id, organizationId: user.organization_id, roles });
    res.json({ accessToken: access });
  } catch (e) { next(e); }
});