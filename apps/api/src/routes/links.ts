import { Router } from 'express';
import { authRequired, AuthedRequest } from '../middleware/authRequired';
import { LinkService } from '../services/linkService';
import { enqueueIndexLink } from '../queues/indexQueue';

const router = Router();

// Create link (protected)
router.post('/', authRequired, async (req: AuthedRequest, res) => {
  try {
    const { url, workspaceId } = req.body as { url?: string; workspaceId?: string };
    if (!url) return res.status(400).json({ error: 'url is required' });

    const link = await LinkService.create({ url, ownerId: req.user!.id, workspaceId });

    // Enqueue indexing job
    await enqueueIndexLink({ linkId: link.id, ownerId: req.user!.id, url: link.url });

    return res.status(201).json({ id: link.id, status: link.status });
  } catch (err) {
    return res.status(500).json({ error: 'internal_error' });
  }
});

// Get link by id (protected)
router.get('/:id', authRequired, async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;
    const link = await LinkService.getById(id, req.user!.id);
    if (!link) return res.status(404).json({ error: 'not_found' });
    return res.status(200).json(link);
  } catch (err) {
    return res.status(500).json({ error: 'internal_error' });
  }
});

// List recent links (protected)
router.get('/', authRequired, async (req: AuthedRequest, res) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const offset = parseInt((req.query.offset as string) || '0', 10);

    const { items, total } = await LinkService.listRecent(req.user!.id, limit, offset);
    return res.status(200).json({ items, total, limit, offset });
  } catch (err) {
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
