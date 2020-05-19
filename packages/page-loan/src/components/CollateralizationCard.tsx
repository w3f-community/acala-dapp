import React, { FC, ReactNode } from 'react';
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
  const { currentUserLoanHelper } = useLoan(token);

  const listConfig: ListConfig[] = [
    {
      key: 'currentRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
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
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Required Ratio'
    },
    {
      key: 'interestRate',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Interest Rate'
    }
  ];

  const data = {
    currentRatio: currentUserLoanHelper?.collateralRatio,
    interestRate: currentUserLoanHelper?.stableFeeAPR,
    requiredRatio: currentUserLoanHelper?.requiredCollateralRatio
  };

  return (
    <Card
      header='Collateralization'
      padding={false}
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
