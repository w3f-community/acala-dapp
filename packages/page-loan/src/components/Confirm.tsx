import React, { FC, useContext, useMemo, ReactNode } from 'react';

import { FormatBalance, FormatFixed18, TxButton, numToFixed18Inner } from '@acala-dapp/react-components';
import { createProviderContext } from './CreateProvider';
import { useConstants } from '@acala-dapp/react-hooks';
import { Fixed18, stableCoinToDebit, convertToFixed18 } from '@acala-network/app-util';
import { List, Button } from '@acala-dapp/ui-components';
import classes from './Confirm.module.scss';
import { LoanContext } from './LoanProvider';

export const Confirm: FC = () => {
  const {
    currentLoanType,
    currentUserLoan,
    deposit,
    generate,
    getUserLoanHelper,
    selectedToken,
    setStep
  } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();
  const loanHelper = useMemo(() => {
    return getUserLoanHelper(currentUserLoan, currentLoanType, deposit, generate);
  }, [getUserLoanHelper, currentUserLoan, currentLoanType, deposit, generate]);

  const listConfig = [
    {
      key: 'depositing',
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => {
        return (
          <FormatBalance
            balance={deposit}
            currency={selectedToken}
          />
        );
      },
      title: 'Depositing'
    },
    {
      key: 'borrowing',
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => {
        return (
          <FormatBalance
            balance={generate}
            currency={stableCurrency}
          />
        );
      },
      title: 'Borrowing'
    },
    {
      key: 'collateralizationRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Collateralization Ratio'
    },
    {
      key: 'liquidationRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Liquidation Ratio'
    },
    {
      key: 'liquidationPenalty',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Liquidation Fee'
    },
    {
      key: 'liuqidationPrice',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            prefix='$'
          />
        );
      },
      title: 'Liquidation Price'
    },
    {
      key: 'interestRate',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Interest Rate'
    }
  ];

  const data = {
    collateralizationRatio: loanHelper?.collateralRatio,
    interestRate: loanHelper?.stableFeeAPR,
    liquidationPenalty: convertToFixed18(currentLoanType?.liquidationPenalty || 0),
    liquidationRatio: loanHelper?.liquidationRatio,
    liuqidationPrice: loanHelper?.liquidationPrice
  };

  const checkDisabled = (): boolean => {
    return false;
  };

  const getParams = (): string[] => {
    const _params = [
      selectedToken.toString(),
      numToFixed18Inner(deposit),
      '0'
    ];

    if (currentLoanType && loanHelper) {
      _params[2] = stableCoinToDebit(
        Fixed18.fromNatural(generate),
        loanHelper.debitExchangeRate
      ).innerToString();
    }

    return _params;
  };

  const handleSuccess = (): void => {
    setStep('success');
  };

  const handlePrevious = (): void => {
    setStep('generate');
  };

  return (
    <div className={classes.root}>
      <List
        config={listConfig}
        data={data}
        itemClassName={classes.listItem}
      />
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='ghost'
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrevious}
          size='small'
          type='border'
        >
          Prev
        </Button>
        <TxButton
          disabled={checkDisabled()}
          method='adjustLoan'
          onSuccess={handleSuccess}
          params={getParams()}
          section='acala-dapp'
          size='small'
        >
          Confirm
        </TxButton>
      </div>
    </div>
  );
};
