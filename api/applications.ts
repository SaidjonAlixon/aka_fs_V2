import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_API = 'https://api.telegram.org/bot';

interface ApplicationBody {
  position?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  experience?: string;
  cdlType?: string;
  ssn?: string;
  documents?: {
    ssnImage?: string;
    licenseFront?: string;
    licenseBack?: string;
    medicalCard?: string;
    truckInspection?: string;
    enginePhoto?: string;
    underEnginePhoto?: string;
    tirePhoto?: string;
    resume?: string;
    capCard?: string;
  };
}

function buildTelegramMessage(body: ApplicationBody): string {
  const d = body.documents ?? {};
  const lines: string[] = [
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
  return lines.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
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

    console.log('[applications] Incoming request');

    const body = (req.body || {}) as ApplicationBody;
    if (!body || typeof body !== 'object') {
      console.error('[applications] Invalid JSON body (empty or not object)');
      return res.status(400).json({ success: false, error: 'Invalid JSON body' });
    }

    const text = buildTelegramMessage(body);
    const url = `${TELEGRAM_API}${token}/sendMessage`;

    console.log('[applications] Sending Telegram request to', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000);

    let tgRes: Response;
    try {
      tgRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[applications] Telegram fetch failed:', err);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json({
        success: false,
        error:
          err instanceof Error && err.name === 'AbortError'
            ? 'Telegram request timed out'
            : 'Telegram request failed',
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('[applications] Telegram error:', tgRes.status, errText);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json({
        success: false,
        error: 'Failed to send notification',
        details: errText,
      });
    }

    console.log('[applications] Telegram request succeeded');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[applications] Unexpected error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Submission failed',
    });
  }
}
