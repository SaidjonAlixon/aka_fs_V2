import { put } from '@vercel/blob';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(request: Request): Promise<Response> {
  try {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return jsonResponse({ error: 'Blob storage not configured' }, 500);
    }

    const formData = await request.formData();
    const file = formData.get('file') ?? formData.get('blob');
    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: 'No file provided. Use field name "file" or "blob".' }, 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return jsonResponse(
        { error: `File too large. Maximum size is ${MAX_SIZE_BYTES / 1024 / 1024}MB.` },
        400
      );
    }

    const pathname = `driver-apps/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    return jsonResponse({ url: blob.url });
  } catch (err) {
    console.error('[blob-upload]', err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      500
    );
  }
}
