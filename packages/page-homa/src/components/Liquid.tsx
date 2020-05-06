import React, { FC, memo } from 'react';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SelectToken } from './SelectToken';
import { SystemInfo } from './SystemInfo';
import { Grid } from '@honzon-platform/ui-components';
import { Console } from './Console';
import { useApi, useCall } from '@honzon-platform/react-hooks';
import { StakingPool } from './StakingPool';

export const Liquid: FC = memo(() => {
  const { api } = useApi();

  return (
    <Grid container
      direction='column'>
      <Grid item>
        <SelectToken />
      </Grid>
      <Grid container
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
        <StakingPool />
      </Grid>
    </Grid>
  );
});

Liquid.displayName = 'Liquid';
