import React, { FC, useContext } from 'react';
import { FormatBalance, getStableCurrencyId, FormatFixed18, TxButton, numToFixed18Inner } from '@honzon-platform/react-components';
import { createProviderContext } from './CreateProvider';
import { useLoan, useApi } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { List, Button } from '@honzon-platform/ui-components';
import classes from './Confirm.module.scss';

export const Confirm: FC = () => {
  const { api } = useApi();
  const { generate, deposit, selectedToken } = useContext(createProviderContext);
  const { currentLoanType, currentUserLoanHelper } = useLoan(selectedToken);
  const stableCurrency = getStableCurrencyId(api);
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

  };

  const checkDisabled = (): boolean => {
    return false;
  };
  console.log(selectedToken);
  return (
    <div>
      <List
        config={listConfig}
        data={data}
      />
      <div className={classes.action}>
        <Button
          size='small'
          normal
        >
          Previous
        </Button>
        <Button
          size='small'
          normal
        >
          Cancel
        </Button>
        <TxButton
          disabled={checkDisabled()}
          size='small'
          section='honzon'
          method='adjustLoan'
          params={[selectedToken, numToFixed18Inner(deposit), numToFixed18Inner(generate)]}
        >
          Confirm
        </TxButton>
      </div>
    </div>
  );
};
