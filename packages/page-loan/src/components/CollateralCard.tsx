import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Card, ListConfig, List, Dropdown } from '@honzon-platform/ui-components';
import { useAllLoans, useLoan } from '@honzon-platform/react-hooks';
import { formatCurrency, FormatFixed18 } from '@honzon-platform/react-components';
import classes from './CollateralCard.module.scss';
import { Fixed18 } from '@acala-network/app-util';

export const CollateralCard = () => {
  const { loanTypes } = useAllLoans();
  const [active, setActive] = useState<string>('');
  const { getCurrentUserLoanHelper } = useLoan(active);
  const currentUserLoanHelper = getCurrentUserLoanHelper();

  const listConfig: ListConfig[] = [
    {
      key: 'liquidationRatio',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Ratio'
    },
    {
      key: 'requiredCollateralRatio',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Required Collateral Ratio'
    },
    {
      key: 'interestRate',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Interest Rate'
    }
  ];

  useEffect(() => {
    if (!active && !isEmpty(loanTypes) && loanTypes[0].token) {
      setActive(loanTypes[0].token.toString())
    }
  }, [loanTypes, active]);

  if (isEmpty(loanTypes)) {
    return null;
  }

  const data = {
    liquidationRatio: currentUserLoanHelper.liquidationRatio,
    requiredCollateralRatio: currentUserLoanHelper.requiredCollateralRatio,
    interestRate: currentUserLoanHelper.stableFeeAPR
  };

  const handleDropdownChange = (value: string) => {
    setActive(value);
  }

  const dropdownConfig = loanTypes.map((item) => {
    return {
      value: item.token.toString(),
      render: () => formatCurrency(item.token)
    }
  });

  return (
    <Card
      className={classes.root}
      headerClassName={classes.header}
      header={
        <>
          <p>Collateral</p>
          <Dropdown
            border={false}
            value={active}
            size='small'
            config={dropdownConfig}
            onChange={handleDropdownChange}
          />
        </>
      }
      gutter={false}
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
