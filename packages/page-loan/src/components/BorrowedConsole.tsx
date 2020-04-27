import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, Button } from '@honzon-platform/ui-components';
import { Token, FormatBalance, getStableCurrencyId } from '@honzon-platform/react-components';
import { useLoan, useApi } from '@honzon-platform/react-hooks';

import classes from './LoanConsole.module.scss';
import { LonaActionButton } from './LoanActionButton';

interface Props {
  token: CurrencyId | string;
}

export const BorrowedConsole: FC<Props> = ({
  token
}) => {
  const { api } = useApi();
  const { currentUserLoanHelper } = useLoan(token);
  const stableCurrency = getStableCurrencyId(api);

  const checkCanPayBackDisabled = (): boolean => {
    if (!currentUserLoanHelper.canPayBack) {
      return true;
    }
    if (currentUserLoanHelper.canPayBack.isZero()) {
      return true;
    }
    return false;
  };

  const checkCanGenerateDisabled = (): boolean => {
    if (!currentUserLoanHelper.canGenerate) {
      return true;
    }
    if (currentUserLoanHelper.canGenerate.isZero()) {
      return true;
    }
    return false;
  };

  return (
    <Card
      className={classes.console}
      headerClassName={classes.header}
      header={(
        <>
          <div>{'Borrow '} <Token token={token} /></div>
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
          <LonaActionButton
            className={classes.itemAction}
            disabled={checkCanPayBackDisabled()}
            type='payback'
            text='Payback'
            token={token}
            max={
              currentUserLoanHelper.canPayBack?.toNumber()
            }
          />
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
          <LonaActionButton
            className={classes.itemAction}
            disabled={checkCanGenerateDisabled()}
            type='generate'
            text='Generate'
            token={token}
            max={currentUserLoanHelper.canGenerate?.toNumber()}
          />
        </div>
    </Card>
  );
}