import { CurrencyId } from '@acala-network/types/interfaces';
import AccountId from '@polkadot/types/generic/AccountId';

import { useCall } from './useCall';
import { useDexShare } from './useDexShare';
import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { convertToFixed18 } from '@acala-network/app-util';
import { Balance } from '@polkadot/types/interfaces';
import { useConstants } from './useConstants';

export const useDexReward = (token: CurrencyId | string, account?: AccountId | string) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const totalInterest = useCall<Balance>('query.dex.totalInterest', [token]);
  const { share, totalShares } = useDexShare(token, _account);
  const withdrawnInterest = useCall<Balance>('query.dex.withdrawnInterest', [token, _account]);
  const liquidityIncentiveRate = useCall<Balance>('query.dex.liquidityIncentiveRate', [token]);
  const { dexBaseCurrency } = useConstants();

  if (!totalInterest || !share || !totalShares) {
    return { amount: 0,
      token: dexBaseCurrency,
      rewardRatio: liquidityIncentiveRate };
  }

  const _totalInterest = convertToFixed18(totalInterest);
  const _share = convertToFixed18(share);
  const _totalShares = convertToFixed18(totalShares);
  const _withdrawnInterest = convertToFixed18(withdrawnInterest || 0);

  return {
    amount: _share.div(_totalShares).mul(_totalInterest).sub(_withdrawnInterest).toNumber(),
    token: dexBaseCurrency,
    rewardRatio: liquidityIncentiveRate
  };
};
