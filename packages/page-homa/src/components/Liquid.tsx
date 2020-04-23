import React, { FC, memo } from 'react';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SelectToken } from './SelectToken';
import { SystemInfo } from './SystemInfo';
import { Grid } from '@honzon-platform/ui-components';
import { Console } from './Console';

export const Liquid: FC = memo(() => {
  return (
    <Grid container direction='column'>
      <Grid item>
        <SelectToken />
      </Grid>
      <Grid item container>
        <Grid item>
          <Console />
        </Grid>
        <Grid item container direction='column'>
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


