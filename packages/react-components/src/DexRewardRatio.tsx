import React, { memo, FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useDexReward, useApi } from '@honzon-platform/react-hooks';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { FormatFixed18 } from './format';

interface Props {
  token: CurrencyId | string;
}

const YEAR = 365 * 24 * 60 * 60 * 1000;

export const DexRewardRatio: FC<Props> = memo(({ token }) => {
  const { api } = useApi();
  const { rewardRatio } = useDexReward(token);
  const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
  const _rewardRatio = convertToFixed18(rewardRatio || 0);
  const rewardRatioYEAR = _rewardRatio.mul(Fixed18.fromNatural((YEAR / expectedBlockTime)));

  return (
    <FormatFixed18
      data={rewardRatioYEAR}
      format='percentage'
    />
  );
});