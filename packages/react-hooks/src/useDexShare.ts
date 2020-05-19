import { Share, CurrencyId } from '@acala-network/types/interfaces';
import AccountId from '@polkadot/types/generic/AccountId';

import { useCall } from './useCall';
import { useAccounts } from './useAccounts';

interface HooksReturnType {
  share: Share | undefined;
  totalShares: Share | undefined;
}

export const useDexShare = (token: CurrencyId | string, account?: AccountId | string): HooksReturnType => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const share = useCall<Share>('query.dex.shares', [token, _account]);
  const totalShares = useCall<Share>('query.dex.totalShares', [token]);

  return { share, totalShares };
};
