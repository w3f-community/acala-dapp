import React, { useContext, FC, ReactNode } from 'react';
import { Card, TableItem, Table } from '@acala-dapp/ui-components';
import { useCurrentRedeem } from '@acala-dapp/react-hooks';
import { TxButton, FormatBalance } from '@acala-dapp/react-components';

import classes from './RedeemList.module.scss';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { StakingPoolContext } from './StakingPoolProvider';

export const RedeemList: FC = () => {
  const currentRedeem = useCurrentRedeem();
  const { redeemList, stakingPool } = useContext(StakingPoolContext);

  const renderHeader = (): ReactNode => {
    return (
      <div className={classes.header}>
        <div>Redeem Track</div>
        {
          currentRedeem ? (
            <FormatBalance
              balance={convertToFixed18(currentRedeem?.amount)}
              currency={stakingPool?.stakingCurrency}
            />
          ) : null
        }
        {
          currentRedeem ? (
            <TxButton
              method='withdrawRedemption'
              params={[]}
              section='homa'
            >
              Withdraw
            </TxButton>
          ) : null
        }
      </div>
    );
  };

  const tableConfig: TableItem<any>[] = [
    {
      align: 'left',
      dataIndex: 'era',
      /* eslint-disable-next-line react/display-name */
      render: (era: number): ReactNode => {
        return era;
      },
      title: 'Era'
    },
    {
      dataIndex: 'era',
      /* eslint-disable-next-line react/display-name */
      render: (era: number): ReactNode => {
        if (!stakingPool) {
          return '';
        }

        if (stakingPool.currentEra.toNumber() >= era) {
          return 'Done';
        }

        if (stakingPool.currentEra.toNumber() < era) {
          return 'Redeeming';
        }

        return '';
      },
      title: 'Status'
    },
    {
      align: 'right',
      dataIndex: 'balance',
      /* eslint-disable-next-line react/display-name */
      render: (balance: Fixed18): ReactNode => {
        return (
          <FormatBalance
            balance={balance}
            currency={stakingPool?.stakingCurrency}
          />
        );
      },
      title: 'Amount'
    }
  ];

  if (redeemList.length === 0 && !currentRedeem) {
    return null;
  }

  return (
    <Card
      header={renderHeader()}
      padding={false}
    >
      <Table
        config={tableConfig}
        data={redeemList}
        showHeader
        size='small'
      />
    </Card>
  );
};
