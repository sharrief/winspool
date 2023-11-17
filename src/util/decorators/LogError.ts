/* eslint-disable no-param-reassign */
import logger from '@/util/logger';

function handleError(prefix: string, e: any) {
  const msg = `${prefix}: ${e instanceof Error ? e.message : e}`;
  logger.error(msg);
  throw new Error(msg);
}

export default function LogError(errorPrefix: string) {
  return function AddErrorHandling(
    target: Function,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function MethodWithErrorHandling(...args: any) {
      try {
        const result = originalMethod.apply(this, args);
        if (result && result instanceof Promise) {
          return result.catch((error: any) => {
            handleError(errorPrefix, error);
          });
        }
        return result;
      } catch (e) {
        handleError(errorPrefix, e);
      }
    };
    return descriptor;
  };
}
