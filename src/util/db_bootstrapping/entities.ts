import { Prisma } from "@prisma/client";

export type Team<T extends {} = {}> = Prisma.TeamGetPayload<T>
export type Game<T extends {} = {}> = Prisma.GameGetPayload<T>
export type Owner<T extends {} = {}> = Prisma.OwnerGetPayload<T>
export type TeamStats<T extends {} = {}> = Prisma.TeamSeasonStatsGetPayload<T>