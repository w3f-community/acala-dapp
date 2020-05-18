import React, { FC, memo } from 'react';

import classes from './SwapConsole.module.scss';
import { Tag } from '@honzon-platform/ui-components';
import { FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';
import { Fixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

interface Props {
  supplyCurrency: CurrencyId;
  targetCurrency: CurrencyId;
  slippage: number;
  target: number;
  supply: number;
}

export const SwapInfo: FC<Props> = memo(({
  supplyCurrency,
  slippage,
  supply,
  targetCurrency,
  target
}) => {
  return (
    <div className={classes.swapInfoRoot}>
      <p>
        You are selling
        <Tag>
          <FormatBalance balance={supply}
            currency={supplyCurrency} />
        </Tag>
        for at least
        <Tag>
          <FormatBalance balance={target}
            currency={targetCurrency} />
        </Tag>
      </p>
      <p>
        Expected price slippage
        <Tag>
          <FormatFixed18
            data={Fixed18.fromNatural(slippage)}
            format='percentage'
          />
        </Tag>
      </p>
    </div>
  );
});

SwapInfo.displayName = 'SwapInfo';
