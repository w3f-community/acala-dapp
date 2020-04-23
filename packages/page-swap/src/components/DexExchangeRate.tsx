import React, { useContext } from 'react';

import { SwapContext, FormatBalance } from '@honzon-platform/react-components';

export const DexExchangeRate = () => {
  const { calcTarget, supplyCurrency, targetCurrency } = useContext(SwapContext);
  const price = calcTarget(1);

  return (
    <FormatBalance
      pair={[
        {
          balance: 1,
          currency: supplyCurrency
        },
        {
          balance: price,
          currency: targetCurrency
        }
      ]}
      pairSymbol='='
    />
  );
}