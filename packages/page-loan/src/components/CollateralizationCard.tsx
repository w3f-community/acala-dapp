import React, { FC, useContext } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, ListConfig, List } from '@honzon-platform/ui-components';
import { FormatFixed18 } from '@honzon-platform/react-components';
import { Fixed18 } from '@acala-network/app-util';
import { useLoan } from '@honzon-platform/react-hooks';

interface Props {
  token: CurrencyId | string;
}

export const CollateralizationCard: FC<Props> = ({
  token
}) => {
  const { getCurrentUserLoanHelper } = useLoan(token);
  const currentUserLoanHelper = getCurrentUserLoanHelper();

  const listConfig: ListConfig[] = [
    {
      key: 'currentRatio',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
          primary
        />
      ),
      title: 'Current Ratio'
    },
    {
      key: 'requiredRatio',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Required Ratio'
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

  const data = {
    currentRatio: currentUserLoanHelper.collateralRatio,
    requiredRatio: currentUserLoanHelper.requiredCollateralRatio,
    interestRate: currentUserLoanHelper.stableFeeAPR
  };

  return (
    <Card
      gutter={false}
      header='Collateralization'
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
