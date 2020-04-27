import React, { FC, useContext } from 'react';
import { Grid } from '@honzon-platform/ui-components';
import { LoanContext } from './LoanProvider';
import { LiquidationCard } from './LiquidationCard';
import { CollateralizationCard } from './CollateralizationCard';
import { BorrowedConsole } from './BorrowedConsole';
import { CollateralConsole } from './CollateralConsole';

export const LoanConsole: FC = () => {
  const { currentTab } = useContext(LoanContext);

  return (
    <Grid container direction='column'>
      <Grid item container>
        <Grid item flex={12}>
          <LiquidationCard token={currentTab} />
        </Grid>
        <Grid item flex={12}>
          <CollateralizationCard token={currentTab} />
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item flex={12}>
          <BorrowedConsole token={currentTab} />
        </Grid>
        <Grid item flex={12}>
          <CollateralConsole token={currentTab} />
        </Grid>
      </Grid>
    </Grid>
  );
};