import React, { FC } from 'react';
import { Card, ListConfig, List } from '@honzon-platform/ui-components';
import { FormatFixed18 } from '@honzon-platform/react-components';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { useApi, useCall, useConstants } from '@honzon-platform/react-hooks';
import { Balance } from '@open-web3/orml-types/interfaces';

export const SystemInfoCard: FC = () => {
  const { api } = useApi();
  const { stableCurrency } = useConstants();
  const issuance = useCall<Balance>(api.query.tokens.totalIssuance, [stableCurrency]);

  const listConfig: ListConfig[] = [
    {
      key: 'stableCoinSupply',
      render: (data: Fixed18) => (
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
      padding={false}
      header='System Info'
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
