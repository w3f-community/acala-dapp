import React, { FC, useContext, useEffect, useState } from 'react';
import { noop } from 'lodash';

import { Card, ListConfig, List } from '@honzon-platform/ui-components';
import { StakingPoolContext, formatCurrency } from '@honzon-platform/react-components';
import { convertToFixed18 } from '@acala-network/app-util';
import { FormatFixed18 } from '@honzon-platform/react-components/format/FormatFixed18';

export const StakingPoolOverview: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const listConfig: ListConfig[] = [
    {
      key: 'total',
      title: `Total ${formatCurrency(stakingPool.stakingCurrency)}`,
      render: (data) => <FormatFixed18 data={data} />
    },
    {
      key: 'totalBound',
      title: `Total Bound ${formatCurrency(stakingPool.stakingCurrency)}`,
      render: (data) => <FormatFixed18 data={data} />
    },
    {
      key: 'totalFree',
      title: `Total Free ${formatCurrency(stakingPool.stakingCurrency)}`,
      render: (data) => <FormatFixed18 data={data} />
    },
    {
      key: 'unlocking',
      title: `UnLocking ${formatCurrency(stakingPool.stakingCurrency)}`,
      render: (data) => <FormatFixed18 data={data} />
    },
    {
      key: 'boundRatio',
      title: 'Bound Ratio',
      render: (data) => <FormatFixed18 data={data} />
    }
  ];

  if (!stakingPool) {
    return null;
  }

  const listData = {
    total: stakingPoolHelper.communalTotal,
    totalBound: convertToFixed18(stakingPool.totalBonded),
    totalFree: convertToFixed18(stakingPool.freeUnbonded),
    unlocking: convertToFixed18(stakingPool.unbondingToFree),
    boundRatio: stakingPoolHelper.communalBondedRatio
  };

  return (
    <Card elevation={1} header='Staking Pool Overview' divider={true}>
      <List config={listConfig} data={listData} />
    </Card>
  );
};