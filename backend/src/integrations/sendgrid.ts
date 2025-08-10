import sg from '@sendgrid/mail';
import { config } from '../config.js';

export function initSendgrid() {
  if (config.integrations.sendgridApiKey) sg.setApiKey(config.integrations.sendgridApiKey);
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!config.integrations.sendgridApiKey) return { skipped: true } as const;
  await sg.send({ to, from: 'no-reply@cliniglobal.example', subject, html });
  return { ok: true } as const;
}