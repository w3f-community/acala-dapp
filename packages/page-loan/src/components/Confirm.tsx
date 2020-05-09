import React, { FC, useContext, useEffect, useState } from 'react';

import { FormatBalance, FormatFixed18, TxButton, numToFixed18Inner } from '@honzon-platform/react-components';
import { createProviderContext } from './CreateProvider';
import { useLoan, useConstants } from '@honzon-platform/react-hooks';
import { Fixed18, stableCoinToDebit, convertToFixed18, LoanHelper } from '@acala-network/app-util';
import { List, Button } from '@honzon-platform/ui-components';
import classes from './Confirm.module.scss';
import { LoanContext } from './LoanProvider';

export const Confirm: FC = () => {
  const { deposit, generate, selectedToken, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { currentLoanType, currentUserLoan, getUserLoanHelper } = useLoan(selectedToken);
  const [loanHelper, setLoanHelper] = useState<LoanHelper | null>();
  const { stableCurrency } = useConstants();

  useEffect(() => {
    setLoanHelper(getUserLoanHelper(currentUserLoan, currentLoanType, deposit, generate));
  }, [generate, deposit, currentUserLoan, currentLoanType]);

  const listConfig = [
    {
      key: 'depositing',
      render: (value: number) => {
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
      render: (value: number) => {
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
      render: (data: Fixed18) => {
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
      render: (data: Fixed18) => {
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
      render: (data: Fixed18) => {
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
      render: (data: Fixed18) => {
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
      render: (data: Fixed18) => {
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
    liquidationRatio: loanHelper?.liquidationRatio,
    liquidationPenalty: convertToFixed18(currentLoanType?.liquidationPenalty || 0),
    liuqidationPrice: loanHelper?.liquidationPrice,
    interestRate: loanHelper?.stableFeeAPR
  };

  const checkDisabled = (): boolean => {
    return false;
  };

  const getParams = () => {
    const _params = [
      selectedToken,
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

  const handleSuccess = () => {
    setStep('success');
  };

  const handlePrevious = () => {
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
          section='honzon'
          size='small'
        >
          Confirm
        </TxButton>
      </div>
    </div>
  );
};
