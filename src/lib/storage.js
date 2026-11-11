// Vercel Blob helpers for task attachments (server only).
// Files live in a private Blob store. The browser uploads straight to Blob with a
// short-lived client token scoped to one pathname (so big drawings skip Vercel's
// 4.5 MB request limit), and downloads go through short-lived presigned URLs.

import { head, del, issueSignedToken, presignUrl } from '@vercel/blob';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

export const MAX_FILE_BYTES = 50 * 1024 * 1024;

export const storageConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Token the browser uses to PUT exactly this one file, valid for 10 minutes
export async function createUploadToken(pathname) {
  return generateClientTokenFromReadWriteToken({
    pathname,
    maximumSizeInBytes: MAX_FILE_BYTES,
    validUntil: Date.now() + 10 * 60 * 1000,
    addRandomSuffix: false,
    allowOverwrite: false,
  });
}

export async function createSignedDownloadUrl(pathname, fileName, expiresInSeconds = 300) {
  const validUntil = Date.now() + expiresInSeconds * 1000;
  const signed = await issueSignedToken({ pathname, operations: ['get'], validUntil });
  const { presignedUrl } = await presignUrl(signed, { operation: 'get', pathname, access: 'private', validUntil });
  if (!fileName) return presignedUrl;
  const url = new URL(presignedUrl);
  url.searchParams.set('download', '1');
  return url.toString();
}

export async function objectExists(pathname) {
  try {
    await head(pathname);
    return true;
  } catch {
    return false;
  }
}

export async function removeObject(pathname) {
  await del(pathname);
}
