import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SubnexusValidator } from '@/lib/validators/subnexus';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = SubnexusValidator.parse(body);

    const subnexusExists = await prisma.subnexus.findFirst({
      where: {
        name,
      },
    });

    if (subnexusExists) {
      return new Response('Subnexus already exists', { status: 409 });
    }

    const subnexus = await prisma.subnexus.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subnexusId: subnexus.id,
      },
    });

    return new Response(JSON.stringify({ name: subnexus.name }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response('Could not create subnexus', { status: 405 });
  }
}
