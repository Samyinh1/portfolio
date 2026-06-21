import { Router } from 'express';
import { sendContactMessage, subscribeMessages } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', sendContactMessage);
router.get('/stream', requireAuth, subscribeMessages);

export default router;
