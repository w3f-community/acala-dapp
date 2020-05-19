import React, { FC, memo, useContext } from 'react';
import { noop } from 'lodash';

import { Dropdown } from '@honzon-platform/ui-components';
import { formatCurrency } from '@honzon-platform/react-components';

import classes from './SelectToken.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const SelectToken: FC = memo(() => {
  const { stakingPool } = useContext(StakingPoolContext);
  const DEFAULT_VALUE = 'default';
  const config = [
    {
      render: (): string => {
        if (!stakingPool) {
          return '';
        }

        return `${formatCurrency(stakingPool.stakingCurrency)}/${formatCurrency(stakingPool.liquidCurrency)}`;
      },
      value: DEFAULT_VALUE
    }
  ];

  return (
    <Dropdown
      activeContentClassName={classes.activeContent}
      className={classes.root}
      config={config}
      onChange={noop}
      placeholder={''}
      value={DEFAULT_VALUE}
    />
  );
});

SelectToken.displayName = 'SelectToken';
