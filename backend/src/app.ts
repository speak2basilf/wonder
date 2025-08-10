import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import { router as apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.js';
import { getLogger } from './utils/logger.js';

dotenv.config();

const logger = getLogger('http');

export const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean) || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRouter);

app.use(errorHandler);