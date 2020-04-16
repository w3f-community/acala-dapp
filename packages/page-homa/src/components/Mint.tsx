import React, { FC, memo } from 'react';
import { Grid } from 'semantic-ui-react';

import { StakingTokeBalances } from './StakingTokenBalances';
import { StakingManipulate } from './StakingManipulate';
import { StakingPoolOverview } from './StakingPoolOverview';

export const Mint: FC = memo(() => {
  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <StakingManipulate />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <StakingTokeBalances />
        </Grid.Column>
        <Grid.Column>
          <StakingPoolOverview />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

Mint.displayName = 'Mint';
