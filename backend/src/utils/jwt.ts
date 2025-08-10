import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function issueAccessToken(user: { id: string; organizationId: string; roles: string[] }) {
  return jwt.sign({ roles: user.roles, org: user.organizationId }, config.jwtSecret, { subject: user.id, expiresIn: '15m' });
}

export function issueRefreshToken(userId: string) {
  return jwt.sign({}, config.refreshSecret, { subject: userId, expiresIn: '30d' });
}