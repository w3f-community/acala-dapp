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
      headerClassName={classes.header}
      header='For User'
      gutter={false}
    >
      <div className={classes.avatar}>
        <UserIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Reward</p>
          <FormatBalance
            className={classes.listContent}
            currency={totalRewawrd.token}
            balance={totalRewawrd.amount}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Deposit</p>
          <FormatBalance
            className={classes.listContent}
            currency={totalDeposit.token}
            balance={totalDeposit.amount}
          />
        </li>
      </ul>
    </Card>
  );
});

UserCard.displayName = 'UserCard';
