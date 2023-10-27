import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";

export async function getGameCount() {
  return await prisma.game.count();
}

export async function createGames(games: Prisma.GameCreateManyArgs['data']) {
  return await prisma.game.createMany({ data: games });
} 