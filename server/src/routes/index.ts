import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './stocks';
import pingRoute from './ping';

const router = Router();

router.use('/', pingRoute);

router.use('/', authRoutes);

router.use('/', profileRoutes);

export default router;
