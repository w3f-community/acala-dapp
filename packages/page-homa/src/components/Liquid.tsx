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
        <Grid xs={6} item>
          <Console />
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={12}>
              <StakingTokeBalances />
            </Grid>
            <Grid item xs={12}>
              <SystemInfo />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <RedeemList />
      </Grid>
      <Grid item xs={12}>
        <StakingPool />
      </Grid>
      <Grid item xs={12}>
        <Transaction />
      </Grid>
    </Grid>
  );
});

Liquid.displayName = 'Liquid';
