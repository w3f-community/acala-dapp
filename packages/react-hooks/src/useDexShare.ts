import { useCall } from "./useCall";
import { Share, CurrencyId } from "@acala-network/types/interfaces";
import { useApi } from "./useApi";
import { useAccounts } from "./useAccounts";
import AccountId from "@polkadot/types/generic/AccountId";

export const useDexShare = (token: CurrencyId | string, account?: AccountId | string) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const _account = account ? account : active ? active.address : '';
  const share = useCall<Share>(api.query.dex.shares, [token, _account]);
  const totalShares = useCall<Share>(api.query.dex.totalShares, [token]);

  return { share, totalShares };
}