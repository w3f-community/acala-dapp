import React, { FC, memo } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { FormatBalance } from '@honzon-platform/react-components';

import { ReactComponent as SystemIcon } from '../assets/system.svg';
import classes from './Card.module.scss';

export const SystemCard: FC = memo(() => {
  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      headerClassName={classes.header}
      header='For User'
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

SystemCard.displayName = 'SystemCard';
