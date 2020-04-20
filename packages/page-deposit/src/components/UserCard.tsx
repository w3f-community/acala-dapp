import React, { FC, memo } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { FormatBalance } from '@honzon-platform/react-components';

import { ReactComponent as UserIcon } from '../assets/user.svg';
import classes from './Card.module.scss';

export const UserCard: FC = memo(() => {
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
            currency={'AUSD'}
            balance={1}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Deposit (USD)</p>
          <FormatBalance
            className={classes.listContent}
            currency={'AUSD'}
            balance={1}
          />
        </li>
      </ul>
    </Card>
  );
});

UserCard.displayName = 'UserCard';
