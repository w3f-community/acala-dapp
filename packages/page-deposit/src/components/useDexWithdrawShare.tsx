import { useDexPool, useDexShare, useAccounts, useConstants } from '@acala-dapp/react-hooks';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

type HooksReturnType = {
  balance: Fixed18;
  currency: CurrencyId;
}[];

export const useDexWithdrawShare = (token: CurrencyId, withdraw?: number): HooksReturnType => {
  const { active } = useAccounts();
  const { share, totalShares } = useDexShare(token, active ? active.address : '');
  const { dexBaseCurrency } = useConstants();
  const pool = useDexPool(token);

  if (!pool || !share || !totalShares) {
    return [];
  }

  const otherPool = convertToFixed18(pool.other || 0);
  const basePool = convertToFixed18(pool.base || 0);
  const _total = convertToFixed18(totalShares || 0);
  const _share = convertToFixed18(share || 0);
  const withdrawShare = Fixed18.fromNatural(withdraw || 0);
  let ratio = _share.div(_total);

  if (!withdrawShare.isZero()) {
    ratio = withdrawShare.div(_total);
  }

  return [
    {
      balance: otherPool.mul(ratio),
      currency: token
    },
    {
      balance: basePool.mul(ratio),
      currency: dexBaseCurrency
    }
  ];
};
