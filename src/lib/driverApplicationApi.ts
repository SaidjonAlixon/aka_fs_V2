const API_BASE = import.meta.env.DEV ? 'http://localhost:4000' : '';

export async function uploadToBlob(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/blob-upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Upload failed');
  }
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error('No URL returned');
  return data.url;
}

export interface ApplicationPayload {
  position: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  cdlType: string;
  ssn: string;
  documents: {
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

export async function submitApplication(payload: ApplicationPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Submission failed');
  }
  const data = (await res.json()) as { success?: boolean };
  if (!data.success) throw new Error('Submission failed');
}
