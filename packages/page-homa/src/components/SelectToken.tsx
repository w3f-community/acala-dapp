import React, { FC, memo, useContext } from 'react';
import { noop } from 'lodash';

import { Dropdown } from '@honzon-platform/ui-components';
import { StakingPoolContext, formatCurrency } from '@honzon-platform/react-components';

export const SelectToken: FC = memo(() => {
  const { stakingPool } = useContext(StakingPoolContext);
  const DEFAULT_VALUE= 'default';
  const options = [
    {
      value: DEFAULT_VALUE,
      render: (): string => {
        return `${formatCurrency(stakingPool.stakingCurrency)}/${formatCurrency(stakingPool.liquidCurrency)}`;
      }
    }
  ]
  return (
    <Dropdown
      options={options}
      onChange={noop}
      placeholder={''}
      value={DEFAULT_VALUE}
    />
  );
});

SelectToken.displayName = 'SelectToken';
