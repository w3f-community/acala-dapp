import React, { FC, memo } from 'react';
import { CurrencyId, Share } from '@acala-network/types/interfaces';
import AccountId from '@polkadot/types/generic/AccountId';

import { useApi, useCall } from '@honzon-platform/react-hooks';

import { BaseQueryElementProps } from './type';

interface Props extends BaseQueryElementProps<{share: Share, totalShare: Share}> {
  token: CurrencyId;
  account: AccountId | string
}

export const QueryDexShare: FC<Props> = memo(({
  account,
  token,
  render
}) => {
  const { api } = useApi();
  const share = useCall<Share>(api.query.dex.shares, [token, account]);
  const totalShare = useCall<Share>(api.query.dex.totalShares, [token]);

  if (share !== undefined && totalShare !== undefined) {
    return render({ share, totalShare });
  }

  return null;
});

QueryDexShare.displayName = 'QueryDexShare';
