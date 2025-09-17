import type { Request, Response } from 'express';
import got from 'got';

const ES_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const ES_INDEX = process.env.ES_INDEX || 'zesdocs_links';

export async function search(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || '';
    if (!q) return res.status(400).json({ error: 'q_required' });

    const esRes: any = await got.post(`${ES_URL}/${ES_INDEX}/_search`, {
      json: {
        query: {
          multi_match: {
            query: q,
            fields: ['title^2', 'description']
          }
        },
        size: Math.min(parseInt((req.query.size as string) || '20', 10), 50),
      },
      headers: { 'content-type': 'application/json' },
      timeout: { request: 10000 },
      responseType: 'json',
    }).json();

    const hits = (esRes.hits?.hits || []).map((h: any) => ({
      id: h._id,
      score: h._score,
      ...h._source,
    }));

    return res.status(200).json({ hits, total: esRes.hits?.total?.value ?? hits.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'search_failed', message: err.message || String(err) });
  }
}
