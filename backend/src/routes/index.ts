import { Router } from 'express';
import { router as authRouter } from './auth.js';
import { router as leadsRouter } from './leads.js';
import { router as contactsRouter } from './contacts.js';
import { router as accountsRouter } from './accounts.js';
import { router as oppsRouter } from './opportunities.js';
import { router as commsRouter } from './communications.js';
import { router as campaignsRouter } from './campaigns.js';
import { router as segmentsRouter } from './segments.js';
import { router as aiRouter } from './ai.js';
import { router as notesRouter } from './notes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/leads', leadsRouter);
router.use('/contacts', contactsRouter);
router.use('/accounts', accountsRouter);
router.use('/opportunities', oppsRouter);
router.use('/communications', commsRouter);
router.use('/campaigns', campaignsRouter);
router.use('/segments', segmentsRouter);
router.use('/ai', aiRouter);
router.use('/notes', notesRouter);