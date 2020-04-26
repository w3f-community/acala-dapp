import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, Button } from '@honzon-platform/ui-components';
import { Token, FormatBalance, getStableCurrencyId } from '@honzon-platform/react-components';
import { useLoan, useApi } from '@honzon-platform/react-hooks';

import classes from './LoanConsole.module.scss';

interface Props {
  token: CurrencyId | string;
}

export const CollateralConsole: FC<Props> = ({
  token
}) => {
  const { api } = useApi();
  const { currentUserLoanHelper } = useLoan(token);
  const stableCurrency = getStableCurrencyId(api);

  return (
    <Card
      className={classes.console}
      headerClassName={classes.header}
      header={(
        <>
          <p>Collateral <Token token={token} /></p>
          <FormatBalance
            currency={stableCurrency}
            balance={currentUserLoanHelper.collaterals}
          />
        </>
      )}
    >
        <div className={classes.item}>
          <div className={classes.itemContent}>
            <p className={classes.itemTitle}>Required for Safety</p>
            <FormatBalance
              className={classes.itemBalance}
              currency={stableCurrency}
              balance={currentUserLoanHelper.requiredCollateral}
            />
          </div>
          <Button
            className={classes.itemAction}
          >
            Deposit
          </Button>
        </div>
        <div className={classes.item}>
          <div className={classes.itemContent}>
            <p className={classes.itemTitle}>Able to Withdraw</p>
            <FormatBalance
              className={classes.itemBalance}
              currency={stableCurrency}
              balance={
                currentUserLoanHelper.collaterals ?
                currentUserLoanHelper.collaterals
                  .sub(currentUserLoanHelper.requiredCollateral)
                : 0
              }
            />
          </div>
          <Button
              className={classes.itemAction}
          >
              Withdraw
          </Button>
        </div>
    </Card>
  );
}
