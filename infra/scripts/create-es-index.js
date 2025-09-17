#!/usr/bin/env node
const http = require('http');
const { URL } = require('url');

const ES_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const INDEX = process.env.ES_INDEX || 'zesdocs_links';

const mapping = {
  settings: {
    analysis: {
      analyzer: {
        english_with_stop: {
          type: 'standard',
          stopwords: '_english_'
        }
      }
    }
  },
  mappings: {
    properties: {
      id: { type: 'keyword' },
      url: { type: 'keyword' },
      ownerId: { type: 'keyword' },
      title: { type: 'text', analyzer: 'english_with_stop' },
      description: { type: 'text', analyzer: 'english_with_stop' },
      createdAt: { type: 'date' }
    }
  }
};

async function request(method, path, body) {
  const url = new URL(path, ES_URL);
  const data = body ? JSON.stringify(body) : undefined;
  const options = {
    method,
    headers: {
      'content-type': 'application/json',
      'content-length': data ? Buffer.byteLength(data) : 0
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        let parsed = chunks;
        try { parsed = JSON.parse(chunks || '{}'); } catch {}
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(parsed);
        reject(new Error(`HTTP ${res.statusCode}: ${chunks}`));
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    // Check ES health
    const health = await request('GET', '/_cluster/health');
    console.log('Elasticsearch health:', health.status || health);

    // Create index (ignore 400 if already exists)
    try {
      const createRes = await request('PUT', `/${INDEX}`, mapping);
      console.log('Index created:', createRes);
    } catch (e) {
      if (!String(e.message).includes('resource_already_exists_exception')) throw e;
      console.log(`Index ${INDEX} already exists, updating mappings...`);
      await request('PUT', `/${INDEX}/_mapping`, mapping.mappings);
      console.log('Mappings updated.');
    }

    // Show mapping
    const getMap = await request('GET', `/${INDEX}/_mapping`);
    console.log(JSON.stringify(getMap, null, 2));
    console.log('OK: index ready');
  } catch (err) {
    console.error('Failed to create index:', err.message || err);
    process.exit(1);
  }
})();
