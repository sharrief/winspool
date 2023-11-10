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
  const draft = await prisma.seasonDraft.findMany({
    where: { winsPool: { name: poolName } },
    include: {
      owner: true,
      teams: true,
    },
  });
  return NextResponse.json(draft);
}
