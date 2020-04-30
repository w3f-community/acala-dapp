import React, { FC, memo, useContext } from 'react';

import classes from './SwapConsole.module.scss';
import { Tag } from '@honzon-platform/ui-components';
import { FormatBalance, SwapContext, FormatFixed18 } from '@honzon-platform/react-components';
import { Fixed18 } from '@acala-network/app-util';

interface Props {
  target: number;
  supply: number;
}

export const SwapInfo: FC<Props> = memo(({
  supply,
  target
}) => {
  const {
    slippage,
    supplyCurrency,
    targetCurrency,
  } = useContext(SwapContext);

  return (
    <div className={classes.swapInfoRoot}>
      <p>
        You are selling
        <Tag>
          <FormatBalance balance={supply} currency={supplyCurrency} />
        </Tag>
        for at least
        <Tag>
          <FormatBalance balance={target} currency={targetCurrency} />
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
