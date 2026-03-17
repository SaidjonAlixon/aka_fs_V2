import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

function jsonResponse(res, data, status = 200) {
  res.status(status).json(data);
}

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(express.json());

app.options('/api/applications', (req, res) => {
  res.sendStatus(200);
});

app.options('/api/blob-upload', (req, res) => {
  res.sendStatus(200);
});

app.post('/api/applications', async (req, res) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return jsonResponse(res, { error: 'Telegram not configured' }, 500);
    }

    const body = req.body ?? {};
    const d = body.documents ?? {};

    const lines = [
      '🚀 New Driver Application',
      '',
      `Position: ${body.position ?? '—'}`,
      `Name: ${body.name ?? '—'}`,
      `Phone: ${body.phone ?? '—'}`,
      `Email: ${body.email ?? '—'}`,
      `Address: ${body.address ?? '—'}`,
      `Experience: ${body.experience ?? '—'}`,
      `CDL Type: ${body.cdlType ?? '—'}`,
      `SSN / EID: ${body.ssn ?? '—'}`,
      '',
      `Documents: 📎 ${Object.values(d).filter(Boolean).length} file(s)`,
      '',
    ];

    if (d.ssnImage) lines.push(`📎 SSN Image: ${d.ssnImage}`);
    if (d.licenseFront) lines.push(`📎 Driver License Front: ${d.licenseFront}`);
    if (d.licenseBack) lines.push(`📎 Driver License Back: ${d.licenseBack}`);
    if (d.medicalCard) lines.push(`📎 Medical Card: ${d.medicalCard}`);
    if (d.truckInspection) lines.push(`📎 Truck Inspection: ${d.truckInspection}`);
    if (d.enginePhoto) lines.push(`📎 Engine Photo: ${d.enginePhoto}`);
    if (d.underEnginePhoto) lines.push(`📎 Under Engine Photo: ${d.underEnginePhoto}`);
    if (d.tirePhoto) lines.push(`📎 Tire Photo: ${d.tirePhoto}`);
    if (d.resume) lines.push(`📎 Resume: ${d.resume}`);
    if (d.capCard) lines.push(`📎 CAP Card: ${d.capCard}`);

    const text = lines.join('\n');
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('[applications] Telegram error:', tgRes.status, errText);
      return jsonResponse(
        res,
        { error: 'Failed to send notification', details: errText },
        502,
      );
    }

    return jsonResponse(res, { success: true });
  } catch (err) {
    console.error('[applications]', err);
    return jsonResponse(
      res,
      { error: err instanceof Error ? err.message : 'Submission failed' },
      500,
    );
  }
});

app.post('/api/blob-upload', upload.single('file'), async (req, res) => {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return jsonResponse(res, { error: 'Blob storage not configured' }, 500);
    }

    const file = req.file;
    if (!file) {
      return jsonResponse(
        res,
        { error: 'No file provided. Use field name "file".' },
        400,
      );
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return jsonResponse(
        res,
        { error: `File too large. Maximum size is ${MAX_SIZE_BYTES / 1024 / 1024}MB.` },
        400,
      );
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `driver-apps/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    return jsonResponse(res, { url: blob.url });
  } catch (err) {
    console.error('[blob-upload]', err);
    return jsonResponse(
      res,
      { error: err instanceof Error ? err.message : 'Upload failed' },
      500,
    );
  }
});

app.listen(port, () => {
  console.log(`Local backend running on http://localhost:${port}`);
});

