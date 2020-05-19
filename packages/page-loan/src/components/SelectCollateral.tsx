import React, { FC, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';

import { DerivedLoanType } from '@acala-network/api-derive';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { useAccounts, useAllLoans, filterEmptyLoan } from '@acala-dapp/react-hooks';
import { Table, TableItem, Radio, Button } from '@acala-dapp/ui-components';
import { Token, tokenEq, LoanInterestRate, FormatFixed18, UserBalance } from '@acala-dapp/react-components';

import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';
import { LoanContext } from './LoanProvider';

export const SelectCollateral: FC = () => {
  const { loanTypes } = useAllLoans();
  const [selected, setSelected] = useState<CurrencyId>(null as any as CurrencyId);
  const { active } = useAccounts();
  const { setSelectedToken, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const collateralDisabled = useRef<{[k in string]: boolean}>({});
  const { loans } = useAllLoans();

  useEffect(() => {
    const current = filterEmptyLoan(loans);

    loans.forEach(({ token }) => {
      if (current.findIndex((item): boolean => tokenEq(item.token, token)) !== -1) {
        collateralDisabled.current[token.toString()] = false;
      } else {
        collateralDisabled.current[token.toString()] = true;
      }
    });
  }, [loans]);

  const onSelect = (token: CurrencyId): void => {
    setSelected(token);
  };

  const handleNext = (): void => {
    setStep('generate');
    setSelectedToken(selected);
  };

  const checkDisabled = (): boolean => {
    if (!selected) {
      return true;
    }

    return false;
  };

  const tableConfig: TableItem<DerivedLoanType>[] = useMemo(() => [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => {
        const currentUserLoan = loans.find((item) => tokenEq(item.token, token));

        return (
          <Radio
            checked={tokenEq(token, selected)}
            disabled={!currentUserLoan?.collaterals.isEmpty}
            label={<Token token={token}/>}
            onClick={(): void => onSelect(token)}
          />
        );
      },
      title: 'Collateral Type',
      width: 2
    },
    {
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <LoanInterestRate token={token} />,
      title: 'Interest Rate',
      width: 1
    },
    {
      dataIndex: 'requiredCollateralRatio',
      /* eslint-disable-next-line react/display-name */
      render: (collateralRatio: Rate): ReactNode => (
        <FormatFixed18
          data={convertToFixed18(collateralRatio)}
          format='percentage'
        />
      ),
      title: 'Min.Collateral',
      width: 1
    },
    {
      dataIndex: 'liquidationRatio',
      /* eslint-disable-next-line react/display-name */
      render: (liquidationRatio: Rate): ReactNode => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      ),
      title: 'LIQ Ratio',
      width: 1
    },
    {
      dataIndex: 'liquidationPenalty',
      /* eslint-disable-next-line react/display-name */
      render: (liquidationRatio: Rate): ReactNode => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      ),
      title: 'LIQ Fee',
      width: 1
    },
    {
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <UserBalance
          account={active ? active.address : ''}
          token={token}
        />
      ),
      title: 'Avail.Balance',
      width: 1
    }
  ], [active, selected, loans]);

  const handleRowClick = useCallback((_event: any, data: DerivedLoanType) => {
    if (collateralDisabled.current[data.token.toString()]) {
      setSelected(data.token as CurrencyId);
    }
  }, [setSelected]);

  return (
    <div className={classes.root}>
      <Table
        config={tableConfig}
        data={loanTypes}
        rawProps={{
          onClick: handleRowClick
        }}
        showHeader
      />
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='border'
        >
          Cancel
        </Button>
        <Button
          color='primary'
          disabled={checkDisabled()}
          onClick={handleNext}
          size='small'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
