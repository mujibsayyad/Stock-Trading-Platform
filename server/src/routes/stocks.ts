import { Router } from 'express';
import { stockData, stockSearch, HistoricalData } from '../controllers/stocks';

const router = Router();

router.get('/stockdata/search', stockSearch);

router.get('/intraday/:symbol', stockData);

router.get('/historical/:symbol/:day', HistoricalData);

export default router;
