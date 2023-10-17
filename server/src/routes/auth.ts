import { Router } from 'express';
import {
  signin,
  signup,
  validateLogin,
  loginUpstox,
  redirectUpstox,
} from '../controllers/auth';
import isAuthenticate from '../middlewares/isAuth';

const router = Router();

router.get('/validate', isAuthenticate, validateLogin);

router.get('/upstox', loginUpstox);

router.get('/redirect', redirectUpstox);

router.post('/signin', signin);

router.post('/signup', signup);

export default router;
