import { Router } from 'express';
import isAuthenticate from '../middlewares/isAuth';
import { stockData, stockSearch } from '../controllers/stocks';

const router = Router();

router.use(isAuthenticate);

router.get('/intraday/:symbol', stockData);

router.get('/stockdata/search', stockSearch);

export default router;
