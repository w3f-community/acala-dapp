import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { QueryDexPool } from '@honzon-platform/react-query';
import { FormatBalance } from '@honzon-platform/react-components';

interface Props {
  token: CurrencyId;
  baseCurrencyId: CurrencyId;
}
export const ExchangeRate: FC<Props> = memo(({
  baseCurrencyId,
  token
}) => {
  return (
        <QueryDexPool
          token={token}
          render={(result) => (
            <FormatBalance
              pair={[
                { currency: token, balance: 1 },
                { 
                  currency: baseCurrencyId,
                  balance: Fixed18.fromRational(
                    result.base.toString(),
                    result.other.toString()
                  ) 
                }
              ]} 
              pairSymbol='='
            />
          )}
        />
  );
});

ExchangeRate.displayName = 'ExchangeRate';
