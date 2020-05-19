import React, { FC, ReactNode } from 'react';
import { Card, ListConfig, List } from '@honzon-platform/ui-components';
import { FormatFixed18 } from '@honzon-platform/react-components';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { useCall, useConstants } from '@honzon-platform/react-hooks';
import { Balance } from '@open-web3/orml-types/interfaces';

export const SystemInfoCard: FC = () => {
  const { stableCurrency } = useConstants();
  const issuance = useCall<Balance>('query.tokens.totalIssuance', [stableCurrency]);

  const listConfig: ListConfig[] = [
    {
      key: 'stableCoinSupply',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18 data={data} />
      ),
      title: `${stableCurrency.toString()} in Supply`
    }
  ];

  const data = {
    stableCoinSupply: convertToFixed18(issuance && !issuance.isEmpty ? issuance : 0)
  };

  return (
    <Card
      header='System Info'
      padding={false}
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
