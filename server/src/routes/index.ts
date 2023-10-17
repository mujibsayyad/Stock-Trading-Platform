import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './stocks';

const router = Router();

router.use('/', authRoutes);

router.use('/', profileRoutes);

export default router;
