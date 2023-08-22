import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, content, subnexusName } = PostValidator.parse(body);

    const subnexus = await prisma.subnexus.findFirst({
      where: {
        name: subnexusName,
      },
    });

    if (!subnexus) {
      return new Response('Subnexus does not exist', { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subnexusId: subnexus.id,
      },
    });

    return new Response(JSON.stringify({ id: post.id }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response('Unable to create post.', { status: 405 });
  }
}
