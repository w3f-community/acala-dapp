import React, { FC, memo, useContext } from 'react';
import { noop } from 'lodash';

import { Dropdown } from '@honzon-platform/ui-components';
import { StakingPoolContext, formatCurrency } from '@honzon-platform/react-components';

import classes from './SelectToken.module.scss';

export const SelectToken: FC = memo(() => {
  const { stakingPool } = useContext(StakingPoolContext);
  const DEFAULT_VALUE = 'default';
  const config = [
    {
      value: DEFAULT_VALUE,
      render: (): string => {
        if (!stakingPool) {
          return '';
        }

        return `${formatCurrency(stakingPool.stakingCurrency)}/${formatCurrency(stakingPool.liquidCurrency)}`;
      }
    }
  ];

  return (
    <Dropdown
      className={classes.root}
      activeContentClassName={classes.activeContent}
      config={config}
      onChange={noop}
      placeholder={''}
      value={DEFAULT_VALUE}
    />
  );
});

SelectToken.displayName = 'SelectToken';
