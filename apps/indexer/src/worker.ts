import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import got from 'got';
import fs from 'fs';
import path from 'path';
import { parseHtmlMetadata } from './parsers/html';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl);

const QUEUE_NAME = 'index-link';
const TMP_DIR = path.resolve(__dirname, '../tmp');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key';

const ES_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const ES_INDEX = process.env.ES_INDEX || 'zesdocs_links';

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
}

async function fetchHtml(url: string): Promise<string> {
  const res = await got(url, {
    timeout: { request: Number(process.env.REQUEST_TIMEOUT || 30000) },
    headers: {
      'user-agent': process.env.USER_AGENT || 'ZesdocsIndexer/1.0 (+https://zesdocs.dev)'
    },
    followRedirect: true,
    retry: {
      limit: Number(process.env.MAX_RETRIES || 2),
    },
  });
  return res.body as string;
}

async function persistMetadata(linkId: string, meta: ReturnType<typeof parseHtmlMetadata>) {
  const payload: any = {
    title: meta.title,
    description: meta.description,
    imageUrl: meta.image,
    siteName: meta.siteName,
    canonicalUrl: meta.canonicalUrl,
    status: 'READY',
  };

  await got.post(`${API_URL}/internal/links/${linkId}/metadata`, {
    json: payload,
    headers: {
      'x-internal-key': INTERNAL_API_KEY,
      'content-type': 'application/json',
    },
    timeout: { request: 15000 },
  });
}

async function indexToElasticsearch(doc: {
  id: string;
  url: string;
  ownerId: string;
  title?: string;
  description?: string;
  createdAt: string;
}) {
  await got.put(`${ES_URL}/${ES_INDEX}/_doc/${doc.id}`, {
    json: doc,
    headers: { 'content-type': 'application/json' },
    timeout: { request: 10000 },
  });
}

async function handleJob(job: Job<{ linkId: string; ownerId: string; url: string }>) {
  const { linkId, ownerId, url } = job.data;
  console.log(`[indexer] Received job id=${job.id} linkId=${linkId} ownerId=${ownerId} url=${url}`);

  ensureTmpDir();

  try {
    const html = await fetchHtml(url);
    const filePath = path.join(TMP_DIR, `${linkId}.html`);
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`[indexer] Saved HTML to ${filePath} (${html.length} bytes)`);

    const meta = parseHtmlMetadata(html, url);

    await persistMetadata(linkId, meta);
    console.log(`[indexer] Persisted metadata for ${linkId}`);

    await indexToElasticsearch({
      id: linkId,
      url,
      ownerId,
      title: meta.title,
      description: meta.description,
      createdAt: new Date().toISOString(),
    });
    console.log(`[indexer] Indexed doc in Elasticsearch id=${linkId}`);
  } catch (err: any) {
    console.error(`[indexer] Fetch/Parse/Persist/Index failed for ${url}: ${err.message || err}`);
    throw err;
  }

  console.log(`[indexer] Completed job id=${job.id} linkId=${linkId}`);
  return { linkId };
}

const worker = new Worker(QUEUE_NAME, handleJob, {
  connection,
  concurrency: Number(process.env.WORKER_CONCURRENCY || 2),
});

worker.on('completed', (job) => {
  console.log(`[indexer] Job completed id=${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[indexer] Job failed id=${job?.id} error=${err.message}`);
});

console.log(`[indexer] Worker listening on queue=${QUEUE_NAME} redis=${redisUrl}`);

