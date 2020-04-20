import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { FormatFixed18 } from '@honzon-platform/react-components';
import { QueryDexShare } from '@honzon-platform/react-query/QueryDexShare';

interface Props {
  token: CurrencyId;
  account: string;
}
export const AccountShare: FC<Props> = memo(({
  account,
  token
}) => {
  return (
    <QueryDexShare
    token={token}
    account={account}
    render={(result) => {
      const total = convertToFixed18(result.totalShare);
      const share = convertToFixed18(result.share);
      return (
        <FormatFixed18
          data={share.div(total)}
          format='percentage'
        />
      );
    }}
  />
  );
});

AccountShare.displayName = 'AccountShare';
