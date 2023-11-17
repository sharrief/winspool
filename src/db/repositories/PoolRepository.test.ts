import prisma from '@/db/prisma';
import PoolRepository from '@/db/repositories/PoolRepository';
import ERROR from '@/util/errorMessages';

const prismaFindFirstSpy = jest.spyOn(prisma.winsPool, 'findFirst');

afterEach(() => {
  prismaFindFirstSpy.mockReset();
});

describe('findByName', () => {
  it('returns null if provided invalid arguments', async () => {
    const result = await PoolRepository.findByName(1 as any);
    expect(result).toBeNull();
  });

  it('returns the pool matching the name from the database', async () => {
    const name = 'poolName';
    const mockPool = { name };
    prismaFindFirstSpy.mockResolvedValue(mockPool as any);
    const result = await PoolRepository.findByName(name);
    expect(prismaFindFirstSpy).toHaveBeenCalledTimes(1);
    expect(prismaFindFirstSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ name }),
    }));
    expect(result).toBe(mockPool);
  });

  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaFindFirstSpy.mockRejectedValue(new Error(testError));
    await expect(PoolRepository.findByName('poolName'))
      .rejects.toThrowError(`${ERROR.POOL_FIND_BY_NAME}: ${testError}`);
  });
});
