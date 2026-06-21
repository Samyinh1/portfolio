import { Router } from 'express';
import { getProfile, uploadResume, upsertProfile } from '../controllers/profileController.js';
import { parseResumePdf } from '../controllers/resumeParseController.js';
import { requireAuth } from '../middleware/auth.js';
import upload, { memoryUpload } from '../middleware/upload.js';

const router = Router();

router.get('/', getProfile);
router.put('/', requireAuth, upsertProfile);
router.post('/resume', requireAuth, upload.single('resume'), uploadResume);
router.post('/parse-resume', requireAuth, memoryUpload.single('resume'), parseResumePdf);

export default router;
