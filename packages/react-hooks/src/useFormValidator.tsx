import { useApi } from "./useApi";
import { useAccounts } from "./useAccounts";
import { CurrencyId, Amount } from "@acala-network/types/interfaces";
import { convertToFixed18, Fixed18 } from "@acala-network/app-util";

interface BalanceConfig {
  type: 'balance';
  currency: CurrencyId;
  max?: number;
  min?: number;
}

interface NumberConfig {
  type: 'number';
  max?: number;
  min?: number;
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

export const useFormValidator = (configs: Config) => { const { api } = useApi();
  const { active } = useAccounts();
  const numberPattern = /^\-?([1-9]\d*|0)(\.\d{1,5})?$/;

  return (values: any) => {
    const error = {} as any;

    return new Promise((resolve, reject) => {
      Object.keys(values).forEach((key): void => {
        const config = configs[key];
        const value = values[key];

        if (config.type === 'balance') {
          (api.derive as any).currencies.balance(active!.address, config.currency).then((result: Amount) => {
            const _balance = convertToFixed18(result);
            const _value = Fixed18.fromNatural(value);
            const _max = Fixed18.fromNatural(config.max !== undefined ? config.max : Number.MAX_VALUE);
            const _min = Fixed18.fromNatural(config.min !== undefined ? config.min : Number.MIN_VALUE);

            if (!numberPattern.test(value)) {
              error[key] = 'Not a validate number';
            }

            if (_value.isGreaterThan(_balance)) {
              error[key] = 'Balance is not enough';
            }

            if (_value.isGreaterThan(_max)) {
              error[key] = `Value is bigger than ${config.max}`;
            }

            if (_value.isLessThan(_min)) {
              error[key] = `Value is less than ${config.min}`;
            }
          });
        }

        if (config.type === 'number') {
          const _value = Fixed18.fromNatural(value);
          const _max = Fixed18.fromNatural(config.max !== undefined ? config.max : Number.MAX_VALUE);
          const _min = Fixed18.fromNatural(config.min !== undefined ? config.min : Number.MIN_VALUE);

          if (!numberPattern.test(value.toString())) {
            error[key] = 'Not a validate number';
          }

          if (_value.isGreaterThan(_max)) {
            error[key] = `Value is bigger than ${config.max}`;
          }

          if (_value.isLessThan(_min)) {
            error[key] = `Value is less than ${config.min}`;
          }
        }

        if (config.type === 'string') {
          const length = (value as string).length;

          if (config.pattern !== undefined && !config.pattern.test(value)) {
            error[key] = `Value is not a validate string`;
          }

          if (config.max !== undefined && length > config.max) {
            error[key] = `Value is more than ${config.max}`
          }
          if (config.min !== undefined && length < config.min) {
            error[key] = `Value is less than ${config.max}`
          }
        }
      });

      resolve(error);
    });
  }
};