import { Router } from 'express';
import isAuthenticate from '../middlewares/isAuth';
import { stockData, stockSearch } from '../controllers/stocks';

const router = Router();

router.get('/stockdata/search', stockSearch);

router.use(isAuthenticate);

router.get('/intraday/:symbol', stockData);


export default router;
