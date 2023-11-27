import prisma from '@/db/prisma';
import PoolRepository from '@/db/repositories/PoolRepository';
import ERROR from '@/util/errorMessages';

const prismaPoolFindFirstSpy = jest.spyOn(prisma.winsPool, 'findFirst');
const prismaDraftFindManySpy = jest.spyOn(prisma.seasonDraft, 'findMany');

afterEach(() => {
  prismaPoolFindFirstSpy.mockReset();
  prismaDraftFindManySpy.mockReset();
});

describe('findByName', () => {
  it('returns null if provided invalid arguments', async () => {
    const result = await PoolRepository.findByName(1 as any);
    expect(result).toBeNull();
  });

  it('returns the pool matching the name from the database', async () => {
    const name = 'poolName';
    const mockPool = { name };
    prismaPoolFindFirstSpy.mockResolvedValue(mockPool as any);
    const result = await PoolRepository.findByName(name);
    expect(prismaPoolFindFirstSpy).toHaveBeenCalledTimes(1);
    expect(prismaPoolFindFirstSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ name }),
    }));
    expect(result).toBe(mockPool);
  });

  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaPoolFindFirstSpy.mockRejectedValue(new Error(testError));
    await expect(PoolRepository.findByName('poolName'))
      .rejects.toThrowError(`${ERROR.POOL_FIND_BY_NAME}: ${testError}`);
  });
});

describe('getDraftPicks', () => {
  it('returns null if provided invalid arguments', async () => {
    const result = await PoolRepository.getDraftPicks(1 as any);
    expect(result).toBeNull();
  });

  it('returns the drafts for the pool from the database', async () => {
    const name = 'poolName';
    const mockDraft = { name };
    prismaDraftFindManySpy.mockResolvedValue(mockDraft as any);
    const result = await PoolRepository.getDraftPicks(name);
    expect(prismaDraftFindManySpy).toHaveBeenCalledTimes(1);
    expect(prismaDraftFindManySpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ winsPool: expect.objectContaining({ name }) }),
      include: expect.objectContaining({
        winsPool: true,
        owner: true,
        teams: true,
      }),
    }));
    expect(result).toBe(mockDraft);
  });

  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaDraftFindManySpy.mockRejectedValue(new Error(testError));
    await expect(PoolRepository.getDraftPicks('poolName'))
      .rejects.toThrowError(`${ERROR.POOL_GET_PICKS}: ${testError}`);
  });
});
