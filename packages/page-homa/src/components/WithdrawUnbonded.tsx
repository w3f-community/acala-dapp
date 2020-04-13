import React, {ChangeEventHandler, FC, useContext, useState} from 'react';
import {Card} from "@honzon-platform/ui-components";
import { Fixed18 } from '@acala-network/app-util';
import { Grid, TextField, Typography, Box } from "@material-ui/core";
import {StakingPoolContext, TxButton, formatBalance} from "@honzon-platform/react-components";
import { useApi, useAccounts, useCall } from '@honzon-platform/react-hooks';
import { Codec } from '@polkadot/types/types';
import { BalanceWrapper } from '@acala-network/types/interfaces';

export const WithdrawUnbonded: FC = () => {
  const { stakingPool } = useContext(StakingPoolContext);
  const { api } = useApi();
  const { active } = useAccounts();
  const result = useCall<BalanceWrapper>((api.rpc as any).stakingPool.getAvailableUnbonded, [ active ? active.address : '']);

  if (!result) {
    return null;
  }

  return (
    <Card size="large" elevation={1}>
     
      <Grid container alignItems="center" spacing={2} justify="space-between">
        <Typography variant="h5">
          {`You have ${formatBalance(result.amount).toNumber()} can withdraw`}
        </Typography>
        <Grid item>
        {
          !result.amount.isEmpty && (
            <TxButton
              section="homa"
              method="withdrawRedemption"
              params={[]}
            >
              Withdraw
            </TxButton>
          )
        }
        </Grid>
      </Grid>
    </Card>
  );
};


