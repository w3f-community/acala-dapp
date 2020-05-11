import React, { useContext, useMemo, useCallback } from 'react';
import { Card, TableItem, Table } from '@honzon-platform/ui-components';
import { useCurrentRedeem } from '@honzon-platform/react-hooks';
import { TxButton, FormatBalance } from '@honzon-platform/react-components';

import classes from './RedeemList.module.scss';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { StakingPoolContext } from './StakingPoolProvider';

export const RedeemList = () => {
  const currentRedeem = useCurrentRedeem();
  const { stakingPool, redeemList } = useContext(StakingPoolContext);

  const renderHeader = () => {
    return (
      <div className={classes.header}>
        <div>Redeem Track</div>
        {
          currentRedeem && !currentRedeem.isEmpty ? (
            <FormatBalance
              balance={convertToFixed18(currentRedeem)}
              currency={stakingPool?.stakingCurrency}
            />
          ) : null
        }
        {
          currentRedeem && !currentRedeem.isEmpty ? (
            <TxButton
              method='withdrawRedemption'
              section='homa'
              params={[]}
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
      title: 'Era',
      dataIndex: 'era',
      align: 'left',
      render: (era: number) => {
        return era;
      }
    },
    {
      title: 'Status',
      dataIndex: 'era',
      render: (era: number) => {
        if (stakingPool!.currentEra.toNumber() >= era) {
          return 'Done';
        }
        if (stakingPool!.currentEra.toNumber() < era) {
          return 'Redeeming';
        }
        return '';
      }
    },
    {
      align: 'right',
      title: 'Amount',
      dataIndex: 'balance',
      render: (balance: Fixed18) => {
        return (
          <FormatBalance
            balance={balance}
            currency={stakingPool?.stakingCurrency}
          />
        );
      }
    },
  ];

  return useMemo(() => {
    return (
      <Card
        header={renderHeader()}
        padding={false}
      >
        <Table
          size='small'
          showHeader
          config={tableConfig}
          data={redeemList}
        />
      </Card>
    );
  }, [currentRedeem, stakingPool, redeemList]);
};
