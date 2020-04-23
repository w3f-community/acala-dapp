import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { QueryDexPool } from '@honzon-platform/react-query';
import { FormatBalance } from '@honzon-platform/react-components';
import { useApi } from '@honzon-platform/react-hooks';

interface Props {
  token: string | CurrencyId;
}

export const DexExchangeRate: FC<Props> = memo(({ token }) => {
  const { api } = useApi();
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;

  return (
        <QueryDexPool
          token={token}
          render={(result) => (
            <FormatBalance
              pair={[
                { currency: token, balance: 1 },
                { 
                  currency: baseCurrency,
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

DexExchangeRate.displayName = 'DexExchangeRate';
