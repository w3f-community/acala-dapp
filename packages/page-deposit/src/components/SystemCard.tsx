import React, { FC, memo, useContext } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';

import { ReactComponent as SystemIcon } from '../assets/system.svg';
import classes from './Card.module.scss';
import { DepositContext } from './Provider';
import { convertToFixed18 } from '@acala-network/app-util';
import { useDexTotalSystemReward } from '@honzon-platform/react-hooks';

export const SystemCard: FC = memo(() => {
  const { exchangeFee } = useContext(DepositContext);
  const totalReward = useDexTotalSystemReward();

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      padding={false}
      header='For System'
      headerClassName={classes.header}
    >
      <div className={classes.avatar}>
        <SystemIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Reward</p>
          <FormatBalance
            balance={totalReward.amount}
            className={classes.listContent}
            currency={totalReward.token}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Transaction Fee</p>
          <FormatFixed18
            data={convertToFixed18(exchangeFee)}
            format='percentage'
          />
        </li>
      </ul>
    </Card>
  );
});

SystemCard.displayName = 'SystemCard';
