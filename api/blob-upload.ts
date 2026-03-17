import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Blob storage not configured' });
    }

    const contentLength = Number(req.headers['content-length'] || 0);
    if (contentLength > MAX_SIZE_BYTES) {
      return res
        .status(400)
        .json({ error: `File too large. Maximum size is ${MAX_SIZE_BYTES / 1024 / 1024}MB.` });
    }

    const originalName =
      (Array.isArray(req.query.filename) ? req.query.filename[0] : req.query.filename) ||
      'upload.bin';

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `driver-apps/${Date.now()}-${safeName}`;

    const blob = await put(pathname, req, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('[blob-upload]', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : 'Upload failed' });
  }
}
