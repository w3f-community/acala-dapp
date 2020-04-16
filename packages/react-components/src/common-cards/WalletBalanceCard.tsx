import React, { FC, memo, ReactElement } from 'react';

import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { QueryAllPrices, QueryBalance } from '@honzon-platform/react-query';
import { DerivedPrice } from '@acala-network/api-derive';
import { Token } from '../Token';
import { convertToFixed18 } from '@acala-network/app-util';
import { useAccounts } from '@honzon-platform/react-hooks';

import { getValueFromTimestampValue } from '../utils';

type TableData = DerivedPrice;

export const WalletBalanceCard: FC = memo(() => {
  const { active } = useAccounts();

  if (!active) {
    return null;
  }

  const tableConfig: TableItem<TableData>[] = [
    {
      dataIndex: 'token',
      render: function cell (token): ReactElement {
        return <Token token={token} />;
      },
      title: 'Token'
    },
    {
      render: function cell (data): ReactElement {
        return (
          <QueryBalance
            account={active.address}
            /* eslint-disable-next-line react/display-name */
            render={(result): ReactElement => <p>{convertToFixed18(result).toNumber()}</p>}
            token={data.token}
          />
        );
      },
      title: 'Token'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: function (data): ReactElement {
        return (
          <QueryBalance
            account={active.address}
            /* eslint-disable-next-line react/display-name */
            render={(result): ReactElement => (
              <p>
                {
                  convertToFixed18(result)
                    .mul(
                      convertToFixed18(getValueFromTimestampValue(data.price))
                    )
                    .toNumber()
                }
              </p>
            )}
            token={data.token}
          />
        );
      },
      title: 'Amount'
    }
  ];

  return (
    <Card header='Wallet Balance'>
      <QueryAllPrices
        /* eslint-disable-next-line react/display-name */
        render={(price): ReactElement => {
          return (
            <Table
              config={tableConfig}
              data={price}
            />
          );
        }}
      />
    </Card>
  );
});

WalletBalanceCard.displayName = 'WalletbalanceCard';
