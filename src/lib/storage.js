// Supabase Storage helpers for task attachments (server only).
// Files go into a private bucket; the browser uploads straight to Supabase with a
// one-time signed URL (so big drawings skip Vercel's 4.5 MB request limit), and
// downloads go through short-lived signed URLs.

export const BUCKET = 'task-attachments';
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

const baseUrl = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const storageConfigured = () => Boolean(baseUrl() && key());

async function storageFetch(path, init = {}) {
  const res = await fetch(`${baseUrl()}/storage/v1${path}`, {
    ...init,
    headers: {
      apikey: key(),
      Authorization: `Bearer ${key()}`,
      ...(init.body && typeof init.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');

let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  const { ok, data } = await storageFetch('/bucket', {
    method: 'POST',
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: MAX_FILE_BYTES }),
  });
  // "already exists" comes back as an error, which is fine
  if (!ok && !/exist/i.test(JSON.stringify(data))) throw new Error(`Could not create storage bucket: ${JSON.stringify(data)}`);
  bucketReady = true;
}

// One-time URL the browser can PUT the file to
export async function createSignedUploadUrl(objectPath) {
  await ensureBucket();
  const { ok, data } = await storageFetch(`/object/upload/sign/${BUCKET}/${encodePath(objectPath)}`, { method: 'POST' });
  if (!ok || !data.url) throw new Error(`Could not create upload URL: ${JSON.stringify(data)}`);
  return `${baseUrl()}/storage/v1${data.url}`;
}

export async function createSignedDownloadUrl(objectPath, fileName, expiresIn = 300) {
  const { ok, data } = await storageFetch(`/object/sign/${BUCKET}/${encodePath(objectPath)}`, {
    method: 'POST',
    body: JSON.stringify({ expiresIn }),
  });
  if (!ok || !data.signedURL) throw new Error(`Could not create download URL: ${JSON.stringify(data)}`);
  const url = `${baseUrl()}/storage/v1${data.signedURL}`;
  return fileName ? `${url}&download=${encodeURIComponent(fileName)}` : url;
}

export async function objectExists(objectPath) {
  const { ok } = await storageFetch(`/object/info/${BUCKET}/${encodePath(objectPath)}`, { method: 'GET' });
  return ok;
}

export async function removeObject(objectPath) {
  await storageFetch(`/object/${BUCKET}`, {
    method: 'DELETE',
    body: JSON.stringify({ prefixes: [objectPath] }),
  });
}
