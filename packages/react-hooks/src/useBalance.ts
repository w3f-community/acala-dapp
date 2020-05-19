import { useAccounts } from './useAccounts';
import { useCall } from './useCall';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';

export const useBalance = (currency: CurrencyId | string | undefined): Balance | undefined => {
  const { active } = useAccounts();
  const balance = useCall<Balance>('derive.currencies.balance', [active?.address, currency]);

  if (!currency) {
    return;
  }

  return balance;
};
