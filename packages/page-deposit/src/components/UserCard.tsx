import React, { FC, memo } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { FormatBalance } from '@honzon-platform/react-components';

import { ReactComponent as UserIcon } from '../assets/user.svg';
import classes from './Card.module.scss';
import { useDexTotalReward, useDexTotalDeposit } from '@honzon-platform/react-hooks';

export const UserCard: FC = memo(() => {
  const totalRewawrd = useDexTotalReward();
  const totalDeposit = useDexTotalDeposit();

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      gutter={false}
      header='For User'
      headerClassName={classes.header}
    >
      <div className={classes.avatar}>
        <UserIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Reward</p>
          <FormatBalance
            balance={totalRewawrd.amount}
            className={classes.listContent}
            currency={totalRewawrd.token}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Deposit</p>
          <FormatBalance
            balance={totalDeposit.amount}
            className={classes.listContent}
            currency={totalDeposit.token}
          />
        </li>
      </ul>
    </Card>
  );
});

UserCard.displayName = 'UserCard';
