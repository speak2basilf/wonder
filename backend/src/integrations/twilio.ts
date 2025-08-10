import Twilio from 'twilio';
import { config } from '../config.js';

let client: Twilio.Twilio | null = null;

export function initTwilio() {
  if (config.integrations.twilio.accountSid && config.integrations.twilio.authToken) {
    client = Twilio(config.integrations.twilio.accountSid, config.integrations.twilio.authToken);
  }
}

export async function sendWhatsApp(to: string, body: string) {
  if (!client) return { skipped: true } as const;
  await client.messages.create({
    from: `whatsapp:${config.integrations.twilio.whatsappNumber}`,
    to: `whatsapp:${to}`,
    body
  });
  return { ok: true } as const;
}