import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { useCall } from './useCall';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';

export const useBalance = (currency: CurrencyId | string): Balance | undefined => {
  const { api } = useApi();
  const { active } = useAccounts();
  const balance = useCall<Balance>((api.derive as any).currencies.balance, [active!.address, currency]);

  return balance;
};
