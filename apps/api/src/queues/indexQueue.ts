import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl);

export const INDEX_LINK_QUEUE = 'index-link';

const indexQueue = new Queue(INDEX_LINK_QUEUE, {
  connection,
});

export interface IndexLinkJobData {
  linkId: string;
  ownerId: string;
  url: string;
}

export async function enqueueIndexLink(job: IndexLinkJobData) {
  return indexQueue.add('index', job, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  });
}
