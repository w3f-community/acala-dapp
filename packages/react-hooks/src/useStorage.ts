import { useAccounts } from './useAccounts';
import { useIsAppReady } from './useIsAppReady';

interface Options {
  customPrefix?: string;
  useAccountPrefix?: boolean;
  useCustomPrefix?: boolean;
}
type Get = (key: string) => string | null;
type Set = (key: string, value: string) => void;

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
): { getStorage: Get; setStorage: Set } => {
  const isReady = useIsAppReady();
  const { active: activeAccount } = useAccounts();

  const getStorage: Get = (key) => {
    if (options.useAccountPrefix) {
      if (isReady && activeAccount) {
        const _key = getPrefixKey(key, { ...options, address: activeAccount.address });

        return window.localStorage.getItem(_key);
      }
    } else {
      const _key = getPrefixKey(key, { ...options, address: '' });

      return window.localStorage.getItem(_key);
    }

    return null;
  };

  const setStorage: Set = (key, value) => {
    if (options.useAccountPrefix) {
      if (isReady && activeAccount) {
        const _key = getPrefixKey(key, { ...options, address: activeAccount.address });

        window.localStorage.setItem(_key, value);
      }
    } else {
      const _key = getPrefixKey(key, { ...options, address: '' });

      window.localStorage.setItem(_key, value);
    }
  };

  return { getStorage, setStorage };
};
