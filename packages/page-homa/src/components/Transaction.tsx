import React, { FC, useContext, useMemo } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@honzon-platform/react-components';
import { TableItem } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { StakingPoolContext } from './StakingPoolProvider';
import { noop } from 'rxjs';

export const Transaction: FC = () => {
  const { stakingPool } = useContext(StakingPoolContext);

  const config = useMemo<TableItem<ExtrinsicHistoryData>[]>(() => [
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'left',
      render: (data: ExtrinsicHistoryData) => {

        if (data.method === 'mint') {
          return (
            <FormatBalance
              balance={Fixed18.fromParts(data?.params[0] || 0)}
              currency={stakingPool?.stakingCurrency}
            />
          );
        }
        if (data.method === 'redeem') {
          let _params = {};
          try {
            _params = JSON.parse(data?.params[1]);
          } catch(e) { noop };

          return (
            <>
              <FormatBalance
                balance={Fixed18.fromParts(data?.params[0] || 0)}
                currency={stakingPool?.liquidCurrency}
              />
              <span style={{ marginLeft: 8 }}>
                {(_params as any).Target ? `ERA: ${_params.Target}` : data?.params[1]}
              </span>
            </>
          );
        }
        if (data.method === 'withdrawIncentiveInterest') {
          return (
            <FormatBalance
              balance={data?.addon?.amount}
              currency={data?.addon?.currency}
            />
          );
        }
      },
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'method',
      render: (value: string) => {
        const paramsMap: Map<string, string> = new Map([
          ['mint', 'Mint & Stake'],
          ['redeem', 'Redeem'],
          ['withdrawRedemption', 'Withdraw Redemption']
        ]);
        return paramsMap.get(value);
      },
      title: 'Stake/Redeem'
    },
    {
      align: 'right',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    }
  ], [stakingPool]);

  return (
    <BaseTxHistory
      config={config}
      method={'mint,redeem,withdrawRedemption'}
      section='homa'
    />
  );
};
