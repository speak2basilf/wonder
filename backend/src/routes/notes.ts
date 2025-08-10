import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import axios from 'axios';
import { query } from '../db/pool.js';

const upload = multer();
export const router = Router();

router.use(authenticate);

router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    const org = req.user!.organizationId;
    const author = req.user!.id;
    const { entity_type, entity_id } = req.body as { entity_type: string; entity_id: string };
    const buffer = req.file?.buffer;
    if (!buffer) return res.status(400).json({ error: { message: 'Missing audio file' } });
    const asrUrl = process.env.AI_ASR_URL || 'http://ai-asr:9006/transcribe';
    const { data } = await axios.post(asrUrl, { audio_base64: buffer.toString('base64') });
    const transcript: string = data.transcript;
    const result = await query('INSERT INTO notes(organization_id, author_id, entity_type, entity_id, transcript, tags) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', [org, author, entity_type, entity_id, transcript, ['asr']]);
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
});