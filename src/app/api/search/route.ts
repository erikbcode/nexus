import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query') || '';
    console.log('query: ', query);
    const data = await prisma.subnexus.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 10,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
