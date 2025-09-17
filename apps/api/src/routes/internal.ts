import { Router } from 'express';
import { internalAuth } from '../middleware/internalAuth';
import { updateLinkMetadata } from '../controllers/linksController';

const router = Router();

router.post('/links/:id/metadata', internalAuth, updateLinkMetadata);

export default router;
