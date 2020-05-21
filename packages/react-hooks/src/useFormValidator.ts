import { FormikErrors } from 'formik';

import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { CurrencyId, Amount } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';

interface BalanceConfig {
  type: 'balance';
  currency?: CurrencyId;
  max?: number;
  min?: number;
}

interface NumberConfig {
  type: 'number';
  max?: number;
  min?: number;
  equalMax?: boolean;
  equalMin?: boolean;
}

interface StringConfig {
  type: 'string';
  pattern?: RegExp;
  max?: number;
  min?: number;
}

type Config = {
  [k in string]: BalanceConfig | NumberConfig | StringConfig;
}

export function getFormValidator<T> (configs: Config, api: ApiPromise, active: InjectedAccountWithMeta): (values: T) => void | object | Promise<FormikErrors<T>> {
  const numberPattern = /^([1-9]\d*|0)(\.\d{1,6})?$/;

  return (values: any): void | object | Promise<FormikErrors<T>> => {
    const error = {} as any;

    return new Promise((resolve) => {
      Object.keys(values).forEach((key): void => {
        const config = configs[key];
        const value = values[key];

        if (config.type === 'balance' && config.currency) {
          (api.derive as any).currencies.balance(active.address, config.currency).then((result: Amount) => {
            const _balance = convertToFixed18(result);
            const _value = Fixed18.fromNatural(value);
            const _max = Fixed18.fromNatural(config.max !== undefined ? config.max : Number.MAX_VALUE);
            const _min = Fixed18.fromNatural(config.min !== undefined ? config.min : 0);

            if (!numberPattern.test(value)) {
              error[key] = 'Not a validate number';
            }

            if (_value.isGreaterThan(_balance)) {
              error[key] = 'Balance is not enough';
            }

            if (_value.isGreaterThan(_max)) {
              error[key] = `Value is bigger than ${_max.toNumber()}`;
            }

            if (_value.isLessThan(_min)) {
              error[key] = `Value is less than ${_min.toNumber()}`;
            }
          });
        }

        if (config.type === 'number') {
          if (!numberPattern.test(value.toString())) {
            error[key] = 'Not a validate number';
          }

          if (config.max !== undefined && value > config.max) {
            error[key] = `Value is bigger than ${config.max}`;
          }

          if (config.min !== undefined && value < config.min) {
            error[key] = `Value is less than ${config.min}`;
          }

          if (config.equalMax === false && value === config.max) {
            error[key] = `Value should not equal ${config.max}`;
          }

          if (config.equalMin === false && value === config.min) {
            error[key] = `Value should not equal ${config.min}`;
          }
        }

        if (config.type === 'string') {
          const length = (value as string).length;

          if (config.pattern !== undefined && !config.pattern.test(value)) {
            error[key] = 'Value is not a validate string';
          }

          if (config.max !== undefined && length > config.max) {
            error[key] = `Value's length is bigger than ${config.max}`;
          }

          if (config.min !== undefined && length < config.min) {
            error[key] = `Value's length is less than ${config.min}`;
          }
        }
      });

      resolve(error);
    });
  };
}

export function useFormValidator<T extends any> (configs: Config): (values: T) => void | object | Promise<FormikErrors<T>> {
  const { api } = useApi();
  const { active } = useAccounts();

  if (!active) {
    return (): object => ({ global: "can't get user address" });
  }

  return getFormValidator<T>(configs, api, active);
}
