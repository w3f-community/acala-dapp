import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, Button } from '@honzon-platform/ui-components';
import { Token, FormatBalance, getStableCurrencyId } from '@honzon-platform/react-components';
import { useLoan, useApi } from '@honzon-platform/react-hooks';

import classes from './LoanConsole.module.scss';

interface Props {
  token: CurrencyId | string;
}

export const BorrowedConsole: FC<Props> = ({
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
          <p>{'Borrow '} <Token token={token} /></p>
          <FormatBalance
            currency={stableCurrency}
            balance={currentUserLoanHelper.debitAmount}
          />
        </>
      )}
    >
        <div className={classes.item}>
          <div className={classes.itemContent}>
            <p className={classes.itemTitle}>Can Pay Back</p>
            <FormatBalance
              className={classes.itemBalance}
              currency={stableCurrency}
              balance={currentUserLoanHelper.canPayBack}
            />
          </div>
          <Button
            className={classes.itemAction}
          >
            Payback
          </Button>
        </div>
        <div className={classes.item}>
          <div className={classes.itemContent}>
            <p className={classes.itemTitle}>Can Generate</p>
            <FormatBalance
              className={classes.itemBalance}
              currency={stableCurrency}
              balance={currentUserLoanHelper.canGenerate}
            />
          </div>
          <Button
            className={classes.itemAction}
          >
            Payback
          </Button>
        </div>
    </Card>
  );
}