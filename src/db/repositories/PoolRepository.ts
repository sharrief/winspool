import prisma from '@/db/prisma';
import LogError from '@/util/decorators/LogError';
import ERROR from '@/util/errorMessages';
import { z } from 'zod';

export default class PoolRepository {
  /** Validator for the pool name */
  static nameValidator = z.string();

  /**
   * @param name The name of the pool to load
   * @returns A pool
   */
  @LogError(ERROR.POOL_FIND_BY_NAME)
  static async findByName(name: string) {
    const { success: nameIsValid } = PoolRepository.nameValidator.safeParse(name);
    if (!nameIsValid) return null;

    return prisma.winsPool.findFirst({
      where: { name },
    });
  }

  /**
   * @param name The name of the pool for the draft
   * @returns An array of draft picks
   */
  @LogError(ERROR.POOL_GET_PICKS)
  static async getDraftPicks(poolName: string) {
    const { success: nameIsValid } = PoolRepository.nameValidator.safeParse(poolName);
    if (!nameIsValid) return [];

    return prisma.seasonDraft.findMany({
      where: { winsPool: { name: poolName } },
      include: {
        winsPool: true,
        owner: true,
        teams: true,
      },
    }) ?? [];
  }
}
