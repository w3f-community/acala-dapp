import { useApi } from "./useApi";
import { useAccounts } from "./useAccounts";
import { useCall } from "./useCall";
import { CurrencyId } from "@acala-network/types/interfaces";

export const useBalance = (currency: CurrencyId) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const balance = useCall((api.derive as any).currencys.balance, [active!.address, currency]);

  return balance;
}