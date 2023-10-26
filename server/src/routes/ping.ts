import { Router } from 'express';
import { pingServer } from '../controllers/ping';

const router = Router();

router.get('/ping', pingServer);

export default router;
