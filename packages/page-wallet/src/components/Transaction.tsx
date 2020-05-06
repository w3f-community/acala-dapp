import React, { FC } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@honzon-platform/react-components';
import { TableItem } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';

export const Transaction: FC = () => {
  const config: TableItem<ExtrinsicHistoryData>[] = [
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Hash'
    },
    {
      align: 'right',
      dataIndex: 'signer',
      render: (value) => <FormatHash hash={value} />,
      title: 'From'
    },
    {
      align: 'right',
      dataIndex: 'params',
      render: (value) => <FormatHash hash={value[0]} />,
      title: 'To'
    },
    {
      align: 'right',
      dataIndex: 'params',
      render: (value) => (
        <FormatBalance
          balance={Fixed18.fromParts(value[2])}
          currency={value[1] as string}
        />
      ),
      title: 'Balance'
    },
    {
      align: 'right',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    }
  ];

  return (
    <BaseTxHistory
      config={config}
      method='transfer'
      section='currencies'
    />
  );
};
