import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSignedDownloadUrl, removeObject, storageConfigured } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// GET /api/pm/attachments/[id] — Open/download a file (redirects to a 5-minute signed URL)
// Add ?download=1 to save it instead of opening it in the browser.
export async function GET(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (!storageConfigured()) return NextResponse.json({ error: 'File storage is not set up yet' }, { status: 503 });

  try {
    const { id } = await params;
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) return NextResponse.json({ error: 'File not found' }, { status: 404 });

    const download = new URL(request.url).searchParams.has('download');
    const url = await createSignedDownloadUrl(attachment.path, download ? attachment.fileName : null);
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('Attachment GET Error:', err);
    return NextResponse.json({ error: 'Failed to open file' }, { status: 500 });
  }
}

// DELETE /api/pm/attachments/[id] — Remove a file (admins only)
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const attachment = await prisma.attachment.delete({ where: { id } });
    if (storageConfigured()) await removeObject(attachment.path);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Attachment DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
