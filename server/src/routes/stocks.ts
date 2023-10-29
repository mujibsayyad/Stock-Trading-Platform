import { Router } from 'express';
import isAuthenticate from '../middlewares/isAuth';
import { stockData, stockSearch, HistoricalData } from '../controllers/stocks';

const router = Router();

router.get('/stockdata/search', stockSearch);

router.use(isAuthenticate);

router.get('/intraday/:symbol', stockData);

router.get('/historical/:symbol/:day', HistoricalData);

export default router;
