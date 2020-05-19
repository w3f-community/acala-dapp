import React, { FC, ReactElement, useContext, useCallback, useMemo } from 'react';

import { Card, Tabs } from '@honzon-platform/ui-components';

import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';
import classes from './Console.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const Console: FC = () => {
  const { setAction } = useContext(StakingPoolContext);

  const config = useMemo(() => [
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <StakingConsole />,
      title: 'Mint & Stake',
      value: 'staking'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <RedeemConsole />,
      title: 'Redeem',
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
};
