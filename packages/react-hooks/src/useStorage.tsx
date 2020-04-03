import { useAccounts } from './useAccounts';
import { useIsAppReady } from './useIsAppReady';

interface Options {
  customPrefix: string;
  useAccountPrefix?: boolean;
  useCustomPrefix?: boolean;
}
type Get = (key: string) => string | null;
type Set = (key: string, value: string) => boolean;

const getPrefixKey = (key: string, options: Options & { address: string }): string => {
  if (options.useAccountPrefix) {
    return `${options.address}_${key}`;
  }

  if (options.useCustomPrefix) {
    return `${options.customPrefix}_${key}`;
  }

  return key;
};

export const useStorage = (
  options: Options = { customPrefix: '', useAccountPrefix: true, useCustomPrefix: false }
): { get: Get; set: Set } => {
  const isReady = useIsAppReady();
  const { activeAccount } = useAccounts();

  const get: Get = (key) => {
    if (isReady && activeAccount) {
      const _key = getPrefixKey(key, { ...options, address: activeAccount.address });

      return window.localStorage.getItem(_key);
    }

    return null;
  };

  const set: Set = (key, value) => {
    if (isReady && activeAccount) {
      const _key = getPrefixKey(key, { ...options, address: activeAccount.address });

      window.localStorage.setItem(_key, value);

      return true;
    }

    return false;
  };

  return { get, set };
};
