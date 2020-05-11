import React, { FC } from 'react';
import { Card, Table, TableItem } from '@honzon-platform/ui-components';
import { useHistory, useAccounts, ExtrinsicHistoryData } from '@honzon-platform/react-hooks';

interface Props {
  section: string;
  method: string | string[];
  config?: TableItem<any>[];
}

const defaultTableConfig: TableItem<ExtrinsicHistoryData>[] = [
  {
    key: 'tx',
    title: 'Tx Hash',
    render: (data) => {
      return data.hash;
    }
  }
];

export const BaseTxHistory: FC<Props> = ({
  config = defaultTableConfig,
  method,
  section
}) => {
  const { active } = useAccounts();
  const { result } = useHistory({
    method,
    section,
    signer: active ? active.address : ''
  });

  return (
    <Card
      padding={false}
      header='Transaction'
    >
      <Table
        config={config}
        data={result.slice(0, 10)}
        showHeader
        empty='No Tx History'
      />
    </Card>
  );
};
