import React, { FC, memo, useContext } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';

import { ReactComponent as SystemIcon } from '../assets/system.svg';
import classes from './Card.module.scss';
import { DepositContext } from './Provider';
import { convertToFixed18 } from '@acala-network/app-util';

export const SystemCard: FC = memo(() => {
  const { exchangeFee } = useContext(DepositContext);
  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      headerClassName={classes.header}
      header='For System'
      gutter={false}
    >
      <div className={classes.avatar}>
        <SystemIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Reward</p>
          <FormatBalance
            className={classes.listContent}
            currency={'AUSD'}
            balance={1}
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
