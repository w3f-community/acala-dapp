import React, { FC, memo } from 'react';

import { Grid } from '@honzon-platform/ui-components';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SelectToken } from './SelectToken';
import { SystemInfo } from './SystemInfo';
import { Console } from './Console';
import { StakingPool } from './StakingPool';
import { Transaction } from './Transaction';
import { RedeemList } from './RedeemList';

export const Liquid: FC = memo(() => {
  return (
    <Grid container
      direction='column'>
      <Grid item>
        <SelectToken />
      </Grid>
      <Grid container
        alignItems='stretch'
        item>
        <Grid flex={14}
          item>
          <Console />
        </Grid>
        <Grid container
          direction='column'
          flex={10}
          item>
          <Grid item>
            <StakingTokeBalances />
          </Grid>
          <Grid item>
            <SystemInfo />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <RedeemList />
      </Grid>
      <Grid item>
        <StakingPool />
      </Grid>
      <Grid item>
        <Transaction />
      </Grid>
    </Grid>
  );
});

Liquid.displayName = 'Liquid';
