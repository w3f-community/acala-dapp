import React from 'react';
import { Card, ListConfig, List } from '@honzon-platform/ui-components';

export const CollateralCard = () => {

  const listConfig: ListConfig[] = [
    {
      key: 'liquidationRatio',
      render: () => {
        return 'x';
      },
      title: 'Liquidation Ratio'
    },
    {
      key: 'requiredCollateralRatio',
      render: () => {
        return 'x';
      },
      title: 'Required Collateral Ratio'
    },
    {
      key: 'Interest Rate',
      render: () => {
        return 'x';
      },
      title: 'Interest Rate'
    }
  ];

  const data = {
    liquidationRatio: '',
    requiredCollateralRatio: '',
    interestRate: ''
  };

  return (
    <Card
      header={
        <>
          <p>Collateral</p>
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
