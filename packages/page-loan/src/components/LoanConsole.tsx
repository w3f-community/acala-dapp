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
    <Grid container
      direction='column'>
      <Grid container
        item>
        <Grid item
          xs={6}>
          <LiquidationCard token={currentTab} />
        </Grid>
        <Grid item
          xs={6}>
          <CollateralizationCard token={currentTab} />
        </Grid>
      </Grid>
      <Grid container
        item>
        <Grid item
          xs={6}>
          <BorrowedConsole token={currentTab} />
        </Grid>
        <Grid item
          xs={6}>
          <CollateralConsole token={currentTab} />
        </Grid>
      </Grid>
    </Grid>
  );
};
