import { prisma } from '../db/connection';
import type { Request, Response } from 'express';

export async function updateLinkMetadata(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { title, description, imageUrl, siteName, canonicalUrl, status } = req.body as {
      title?: string;
      description?: string;
      imageUrl?: string;
      siteName?: string;
      canonicalUrl?: string;
      status?: 'READY' | 'FAILED';
    };

    const link = await prisma.link.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        metadata: {
          ...(imageUrl ? { imageUrl } : {}),
          ...(siteName ? { siteName } : {}),
          ...(canonicalUrl ? { canonicalUrl } : {}),
        },
        status: status ?? 'READY',
      },
    });

    return res.status(200).json(link);
  } catch (err) {
    return res.status(500).json({ error: 'internal_error' });
  }
}
