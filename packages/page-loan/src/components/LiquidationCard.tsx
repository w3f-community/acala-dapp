import React, { FC, memo, ReactNode } from 'react';

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
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
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
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Ratio'
    },
    {
      key: 'penalty',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Penalty'
    }
  ];

  const data = {
    penalty: convertToFixed18(currentLoanType ? currentLoanType.liquidationPenalty : 0),
    price: currentUserLoanHelper?.liquidationPrice,
    ratio: currentUserLoanHelper?.liquidationRatio
  };

  return (
    <Card
      header='Liquidation'
      padding={false}
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
});
