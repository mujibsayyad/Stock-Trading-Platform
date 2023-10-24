import { Router } from 'express';
import {
  signin,
  signup,
  logout,
  validateLogin,
  loginUpstox,
  redirectUpstox,
} from '../controllers/auth';
import isAuthenticate from '../middlewares/isAuth';
import { googleOAuthHandler } from '../googleAuth/googleOAuthHandler';

const router = Router();

router.get('/validate', isAuthenticate, validateLogin);

router.get('/oauth/google', googleOAuthHandler);

router.get('/upstox', loginUpstox);

router.get('/redirect', redirectUpstox);

router.post('/signin', signin);

router.post('/signup', signup);

router.post('/logout', logout);

export default router;
