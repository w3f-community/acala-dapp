import React, { FC, memo } from 'react';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SelectToken } from './SelectToken';
import { SystemInfo } from './SystemInfo';
import { Grid } from '@honzon-platform/ui-components';
import { Console } from './Console';
import { useApi, useCall } from '@honzon-platform/react-hooks';

export const Liquid: FC = memo(() => {
  const { api } = useApi();
  // @ts-ignore
  api.rpc.stakingPool.getLiquidStakingExchangeRate(function (result) {
    console.log(result);
  });
  return (
    <Grid container direction='column'>
      <Grid item>
        <SelectToken />
      </Grid>
      <Grid item container>
        <Grid item flex={14}>
          <Console />
        </Grid>
        <Grid item container direction='column' flex={10}>
            <Grid item>
              <StakingTokeBalances />
            </Grid>
            <Grid item>
              <SystemInfo />
            </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

Liquid.displayName = 'Liquid';


