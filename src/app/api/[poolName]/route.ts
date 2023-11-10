import prisma from '@/db/prisma';
import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  context: {
    params: { poolName: string },
  },
) {
  const { params: { poolName } } = context;
  const pool = await prisma.winsPool.findUniqueOrThrow({
    where: { name: poolName },
  });
  return NextResponse.json(pool);
}
