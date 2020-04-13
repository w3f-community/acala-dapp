import React, { FC } from 'react';

import { RedeemManipulate } from './RedeemManipulate';
import { StakingTokeBalances } from './StakingTokenBalances';
import { StakingPoolOverview } from './StakingPoolOverview';
import { WithdrawUnbonded } from './WithdrawUnbonded';
import { Grid } from 'semantic-ui-react';

export const Redeem: FC = () => {
  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <RedeemManipulate />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <WithdrawUnbonded />
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
};
