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

    const isSubscribed = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        subnexusId,
      },
    });

    if (isSubscribed) {
      return new Response('You are already subscribed to this community', { status: 400 });
    }

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subnexusId: subnexusId,
      },
    });

    return new Response(JSON.stringify({ subnexusId: subnexusId }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Could not subscribe to community at this time. Please try again later.', { status: 500 });
  }
}
