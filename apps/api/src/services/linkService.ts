import { prisma } from '../db/connection';

export interface CreateLinkInput {
  url: string;
  ownerId: string;
  workspaceId?: string;
}

export class LinkService {
  static async create(input: CreateLinkInput) {
    const { url, ownerId, workspaceId } = input;

    if (!url || !ownerId) {
      throw new Error('url and ownerId are required');
    }

    const link = await prisma.link.create({
      data: {
        url,
        ownerId,
        workspaceId: workspaceId ?? null,
        status: 'PENDING_INDEX',
      },
    });

    return link;
  }

  static async getById(id: string, ownerId: string) {
    return prisma.link.findFirst({ where: { id, ownerId } });
  }
}
