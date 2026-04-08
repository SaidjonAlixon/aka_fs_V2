import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_API = 'https://api.telegram.org/bot';

interface ContactBody {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function buildTelegramMessage(body: ContactBody): string {
  const lines: string[] = [
    '📩 New Contact Inquiry',
    '',
    `Name: ${body.name ?? '—'}`,
    `Company: ${body.company ?? '—'}`,
    `Email: ${body.email ?? '—'}`,
    `Phone: ${body.phone ?? '—'}`,
    '',
    'Message:',
    body.message ?? '—',
    '',
  ];
  return lines.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // CORS Handling
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(500).json({ success: false, error: 'Telegram not configured' });
    }

    const body = (req.body || {}) as ContactBody;
    const text = buildTelegramMessage(body);
    const url = `${TELEGRAM_API}${token}/sendMessage`;

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
      return res.status(502).json({
        success: false,
        error: 'Failed to send notification',
        details: errText,
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Submission failed',
    });
  }
}
