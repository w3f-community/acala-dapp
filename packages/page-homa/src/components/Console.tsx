import React, { FC, memo, ReactElement, useContext, useCallback, useMemo } from 'react';

import { Card, Tabs } from '@honzon-platform/ui-components';

import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';
import classes from './Console.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const Console: FC = memo(() => {
  const { setAction } = useContext(StakingPoolContext);

  const config = useMemo(() => [
    {
      title: 'Mint & Stake',
      render: (): ReactElement => <StakingConsole />,
      value: 'staking'
    },
    {
      title: 'Redeem',
      render: (): ReactElement => <RedeemConsole />,
      value: 'redeem'
    }
  ], []);

  const handleChange = useCallback((value) => {
    setAction(value);
  }, [setAction]);

  return (
    <Card className={classes.root} >
      <Tabs
        config={config}
        onChange={handleChange}
        style='bar'
        />
    </Card>
  );
});

Console.displayName = 'ConsoleController';
