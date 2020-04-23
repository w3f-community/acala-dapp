import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useDexShare } from '@honzon-platform/react-hooks';
import { FormatFixed18 } from './format';
import { convertToFixed18 } from '@acala-network/app-util';
import { Codec } from '@polkadot/types/types';

interface Props extends BareProps {
  account?: AccountId | string;
  token: CurrencyId | string;
  withRatio?: boolean;
}

export const DexUserShare: FC<Props> = memo(({
  account,
  className,
  token,
  withRatio = true
}) => {
  const {share, totalShares} = useDexShare(token, account);
  const _share = convertToFixed18(share || 0);
  const _totalShares = convertToFixed18(totalShares || 0);

  if (withRatio) {
    return (
      <FormatFixed18
      data={_share.div(_totalShares)}
      format='percentage'
      />
    );
  }
  return (
    <FormatFixed18 data={_share} />
  );
});

DexUserShare.displayName = 'DexUserShare';
