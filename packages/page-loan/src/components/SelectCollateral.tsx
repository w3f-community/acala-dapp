import React, { FC, useContext, useState } from 'react';
import { Table, TableItem, Radio, Button } from '@honzon-platform/ui-components';
import { LoanContext, Token, tokenEq, LoanInterestRate, FormatFixed18, UserBalance } from '@honzon-platform/react-components';
import { DerivedLoanType } from '@acala-network/api-derive';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { useAccounts } from '@honzon-platform/react-hooks';
import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';

export const SelectCollateral: FC = () => {
  const { loanTypes } = useContext(LoanContext);
  const [selected, setSelected] = useState<CurrencyId>(null as any as CurrencyId);
  const { active } = useAccounts();
  const { setStep, setSelectedToken } = useContext(createProviderContext);

  const onSelect = (token: CurrencyId) => {
    setSelected(token);
  };

  const onNext = () => {
    setStep('generate');
    setSelectedToken(selected);
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

  return (
    <div className={classes.root}>
      <Table
        showHeader
        config={tableConfig}
        data={loanTypes}
      />
      <div className={classes.action}>
        <Button
          size='small'
          normal
        >
          Cancel
        </Button>
        <Button
          size='small'
          primary
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}