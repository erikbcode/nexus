import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SubnexusSubscriptionValidator } from '@/lib/validators/subnexus';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { subnexusId } = SubnexusSubscriptionValidator.parse(body);

    const data = { userId: session.user.id, subnexusId: subnexusId };

    const isSubscribed = await prisma.subscription.findUnique({
      where: {
        userId_subnexusId: data,
      },
    });

    if (isSubscribed) {
      await prisma.subscription.delete({
        where: {
          userId_subnexusId: data,
        },
      });

      return new Response(JSON.stringify({ subnexusId: subnexusId }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response('You are not subscribed to this community', { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Could not unsubscribe from this community at this time. Please try again later.', {
      status: 500,
    });
  }
}
