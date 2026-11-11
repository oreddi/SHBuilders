import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { createUploadToken, objectExists, storageConfigured, MAX_FILE_BYTES } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const notConfigured = () =>
  NextResponse.json({ error: 'File storage is not set up yet (BLOB_READ_WRITE_TOKEN missing).' }, { status: 503 });

const safeName = (name) =>
  String(name || 'file').normalize('NFKD').replace(/[^\w.\- ]+/g, '').replace(/\s+/g, '-').slice(-120) || 'file';

// GET /api/pm/tasks/[id]/attachments — List a task's files
export async function GET(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const attachments = await prisma.attachment.findMany({
      where: { taskId: id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(attachments);
  } catch (err) {
    console.error('Attachments GET Error:', err);
    return NextResponse.json({ error: 'Failed to load attachments' }, { status: 500 });
  }
}

// POST /api/pm/tasks/[id]/attachments
//   { step: 'start', fileName, size, contentType }  -> { clientToken, path }  (browser then uploads to Blob)
//   { step: 'finish', path, fileName, size, contentType } -> attachment row
// Any signed-in team member can attach files (e.g. site photos from the field).
export async function POST(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (!storageConfigured()) return notConfigured();

  try {
    const { id } = await params;
    const body = await request.json();
    const size = Number(body?.size) || 0;

    if (size <= 0 || size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `Files must be under ${MAX_FILE_BYTES / 1024 / 1024} MB` }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true, title: true, phase: { select: { projectId: true } } },
    });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    if (body?.step === 'start') {
      const path = `task-attachments/${task.id}/${randomBytes(8).toString('hex')}-${safeName(body.fileName)}`;
      const clientToken = await createUploadToken(path);
      return NextResponse.json({ clientToken, path });
    }

    if (body?.step === 'finish') {
      const path = String(body.path || '');
      // Only accept paths this route handed out for this task, and only once the file is really there
      if (!path.startsWith(`task-attachments/${task.id}/`) || !(await objectExists(path))) {
        return NextResponse.json({ error: 'Upload not found' }, { status: 400 });
      }

      const fileName = String(body.fileName || 'file').slice(0, 200);
      const author = session.user.name || session.user.email || 'Team member';
      const attachment = await prisma.attachment.create({
        data: {
          taskId: task.id,
          fileName,
          path,
          size,
          contentType: body.contentType ? String(body.contentType).slice(0, 100) : null,
          uploadedBy: author,
        },
      });

      await prisma.activity.create({
        data: {
          type: 'comment',
          message: `Attached "${fileName}" to task "${task.title}"`,
          author,
          projectId: task.phase.projectId,
        },
      });

      return NextResponse.json(attachment, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown step' }, { status: 400 });
  } catch (err) {
    console.error('Attachments POST Error:', err);
    return NextResponse.json({ error: 'Failed to attach file' }, { status: 500 });
  }
}
