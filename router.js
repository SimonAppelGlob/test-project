import express from 'express';
import * as advice from './routes/advice';

const router = express.Router();

router.get('/', (req, res) => res.send('API IS UP!'));
router.post(advice.ADVICE_BASE_ROUTE, advice.getAdviceAndStore);

export default router;
