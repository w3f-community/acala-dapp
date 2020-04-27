import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, Button } from '@honzon-platform/ui-components';
import { Token, FormatBalance, getStableCurrencyId } from '@honzon-platform/react-components';
import { useLoan, useApi, useBalance } from '@honzon-platform/react-hooks';

import classes from './LoanConsole.module.scss';
import { LonaActionButton } from './LoanActionButton';
import { convertToFixed18 } from '@acala-network/app-util';

interface Props {
  token: CurrencyId | string;
}

export const CollateralConsole: FC<Props> = ({
  token
}) => {
  const { api } = useApi();
  const { currentUserLoanHelper } = useLoan(token);
  const stableCurrency = getStableCurrencyId(api);
  const balance = useBalance(token);

  return (
    <Card
      className={classes.console}
      headerClassName={classes.header}
      header={(
        <>
          <div>Collateral <Token token={token} /></div>
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
          <LonaActionButton
            className={classes.itemAction}
            type='deposit'
            text='Deposit'
            token={token}
            max={convertToFixed18(balance || 0).toNumber()}
          />
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
          <LonaActionButton
            className={classes.itemAction}
            type='withdraw'
            text='Withdraw'
            token={token}
            max={

                currentUserLoanHelper.collaterals ?
                currentUserLoanHelper.collaterals
                  .sub(currentUserLoanHelper.requiredCollateral)
                  .toNumber()
                : 0
            }
          />
        </div>
    </Card>
  );
}
