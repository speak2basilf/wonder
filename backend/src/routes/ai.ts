import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import axios from 'axios';

export const router = Router();
router.use(authenticate);

router.post('/forecast', async (req, res, next) => {
  try {
    const predictiveUrl = process.env.AI_PREDICTIVE_URL || 'http://ai-predictive:9003/forecast';
    const { data } = await axios.post(predictiveUrl, req.body);
    res.json(data);
  } catch (e) { next(e); }
});

router.post('/search', async (req, res, next) => {
  try {
    const nlpUrl = process.env.AI_NLP_URL || 'http://ai-nlp:9004/search';
    const { data } = await axios.post(nlpUrl, { query: req.body.query });
    res.json(data);
  } catch (e) { next(e); }
});