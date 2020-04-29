import React, { FC, useContext, useState } from 'react';
import { Table, TableItem, Radio, Button } from '@honzon-platform/ui-components';
import { Token, tokenEq, LoanInterestRate, FormatFixed18, UserBalance } from '@honzon-platform/react-components';
import { DerivedLoanType } from '@acala-network/api-derive';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { useAccounts, useAllLoans } from '@honzon-platform/react-hooks';
import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';
import { LoanContext } from './LoanProvider';

export const SelectCollateral: FC = () => {
  const { loanTypes } = useAllLoans({ filterEmpty: false });
  const [selected, setSelected] = useState<CurrencyId>(null as any as CurrencyId);
  const { active } = useAccounts();
  const { setStep, setSelectedToken } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);

  const onSelect = (token: CurrencyId) => {
    setSelected(token);
  };

  const handleNext = () => {
    setStep('generate');
    setSelectedToken(selected);
  };

  const checkDisabled = () => {
    if (!selected) {
      return true;
    }

    return false;
  };

  const tableConfig: TableItem<DerivedLoanType>[] = [
    {
      title: 'Collateral Type',
      width: 2,
      align: 'left',
      dataIndex: 'token',
      render: (token: CurrencyId) => {
        return (
          <Radio
            checked={tokenEq(token, selected as CurrencyId)}
            onClick={() => onSelect(token)}
            label={<Token token={token}/>}
          />
        );
      }
    },
    {
      title: 'Interest Rate',
      width: 1,
      dataIndex: 'token',
      render: (token: CurrencyId) => <LoanInterestRate token={token} />
    },
    {
      title: 'Min.Collateral',
      width: 1,
      dataIndex: 'requiredCollateralRatio',
      render: (collateralRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(collateralRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'LIQ Ratio',
      width: 1,
      dataIndex: 'liquidationRatio',
      render: (liquidationRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'LIQ Fee',
      width: 1,
      dataIndex: 'liquidationPenalty',
      render: (liquidationRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'Avail.Balance',
      width: 1,
      dataIndex: 'token',
      render: (token: CurrencyId) => (
        <UserBalance
          token={token}
          account={active ? active.address : ''}
        />
        )
    },
  ];

  const handleRowClick = (_event: any, data: DerivedLoanType) => {
    setSelected(data.token as CurrencyId);
  };

  return (
    <div className={classes.root}>
      <Table
        showHeader
        config={tableConfig}
        data={loanTypes}
        rawProps={{
          onClick: handleRowClick
        }}
      />
      <div className={classes.action}>
        <Button
          size='small'
          color='normal'
          onClick={cancelCurrentTab}
        >
          Cancel
        </Button>
        <Button
          size='small'
          color='primary'
          disabled={checkDisabled()}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}