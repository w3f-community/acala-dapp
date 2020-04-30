import React, { FC, useContext, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { FormatBalance, FormatFixed18, TxButton, numToFixed18Inner } from '@honzon-platform/react-components';
import { createProviderContext } from './CreateProvider';
import { useLoan, useConstants } from '@honzon-platform/react-hooks';
import { Fixed18, stableCoinToDebit, convertToFixed18 } from '@acala-network/app-util';
import { List, Button } from '@honzon-platform/ui-components';
import classes from './Confirm.module.scss';
import { LoanContext } from './LoanProvider';

export const Confirm: FC = () => {
  const { generate, deposit, selectedToken, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { currentLoanType, getCurrentUserLoanHelper, setCollateral, setDebitStableCoin } = useLoan(selectedToken);
  const currentUserLoanHelper = getCurrentUserLoanHelper();
  const { stableCurrency } = useConstants();

  useEffect(() => {
    if (generate && deposit) {
      setCollateral(deposit);
      setDebitStableCoin(generate);
    }
  }, [generate, deposit]);

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
      title: 'Depositing',
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
      key: 'liquidationFee',
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

  if (isEmpty(currentUserLoanHelper)) {
    return null;
  }

  const data = {
    collateralizationRatio: currentUserLoanHelper.collateralRatio,
    liquidationRatio: currentUserLoanHelper.liquidationRatio,
    liquidationFee: currentLoanType ? convertToFixed18(currentLoanType.liquidationPenalty) : 0,
    liuqidationPrice: currentUserLoanHelper.liquidationPrice,
    interestRate: currentUserLoanHelper.stableFeeAPR,
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
    if (!isEmpty(currentLoanType) && !isEmpty(currentUserLoanHelper)) {
      _params[2] = stableCoinToDebit(
        Fixed18.fromNatural(generate),
        currentUserLoanHelper.debitExchangeRate,
      ).innerToString();
    }
    return _params;
  };

  const handleSuccess = () => {
    setStep('success');
  };

  const handlePrevious = () => {
    setStep('generate');
  }

  return (
    <div className={classes.root}>
      <List
        config={listConfig}
        data={data}
        itemClassName={classes.listItem}
      />
      <div className={classes.action}>
        <Button
          type='ghost'
          size='small'
          onClick={cancelCurrentTab}
        >
          Cancel
        </Button>
        <Button
          type='border'
          size='small'
          onClick={handlePrevious}
        >
          Prev
        </Button>
        <TxButton
          disabled={checkDisabled()}
          size='small'
          section='honzon'
          method='adjustLoan'
          params={getParams()}
          onSuccess={handleSuccess}
        >
          Confirm
        </TxButton>
      </div>
    </div>
  );
};
