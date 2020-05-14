import React, { FC } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash, FormatAddress } from '@honzon-platform/react-components';
import { TableItem, Status } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useApi } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';

export const Transaction: FC = () => {
  const { api } = useApi();
  const config: TableItem<ExtrinsicHistoryData>[] = [
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Hash'
    },
    {
      align: 'left',
      dataIndex: 'signer',
      render: (value) => (
        <FormatAddress
          address={value}
          withIcon
          iconWidth={16}
          withCopy
        />
      ),
      title: 'From'
    },
    {
      align: 'left',
      dataIndex: 'params',
      render: (value) => {
        let address = '';
        try {
          address = encodeAddress(hexToU8a(`0x${value[0]}`));
        } catch (e) {
          // swallow error
        }
        return (
          <FormatAddress
            address={address}
            withIcon
            iconWidth={16}
            withCopy
          />
        );
      },
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
    },
    {
      align: 'right',
      dataIndex: 'success',
      render: (value) => (
        <Status success={value} />
      ),
      title: 'Result'
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
