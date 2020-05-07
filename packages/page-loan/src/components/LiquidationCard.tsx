import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, List } from '@honzon-platform/ui-components';
import { useLoan } from '@honzon-platform/react-hooks';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { FormatFixed18 } from '@honzon-platform/react-components';

interface Props {
  token: CurrencyId | string;
}

export const LiquidationCard: FC<Props> = memo(({
  token
}) => {
  const { currentLoanType, currentUserLoanHelper } = useLoan(token);
  const listConfig = [
    {
      key: 'price',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          prefix='$'
          primary
        />
      ),
      title: 'Liquidation Price'
    },
    {
      key: 'ratio',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Ratio'
    },
    {
      key: 'penalty',
      render: (data: Fixed18) => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Penalty'
    }
  ];

  const data = {
    price: currentUserLoanHelper?.liquidationPrice,
    ratio: currentUserLoanHelper?.liquidationRatio,
    penalty: convertToFixed18(currentLoanType ? currentLoanType.liquidationPenalty : 0)
  };

  return (
    <Card
      padding={false}
      header='Liquidation'
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
});
