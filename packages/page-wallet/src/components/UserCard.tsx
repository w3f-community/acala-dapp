import React, { memo, FC, ReactNode } from 'react';
import Identicon from '@polkadot/react-identicon';

import { Card, Loading } from '@honzon-platform/ui-components';

import { useAccounts } from '@honzon-platform/react-hooks';
import classes from './UserCard.module.scss';
import { FormatAddress } from '@honzon-platform/react-components';

export const UserCard: FC = memo(() => {
  const { active } = useAccounts();
  const renderContent = (): ReactNode => {
    if (!active) {
      return null;
    }

    return (
      <>
        <div className={classes.content}>
          <Identicon
            className={classes.icon}
            value={active.address}
            size={48}
          />
          <div>
            <p className={classes.name}>{active.meta.name || 'User'}</p>
            <FormatAddress
              className={classes.address}
              address={active.address}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <Card className={classes.root}>
    { active ? renderContent() : <Loading /> }
    </Card>
  );
});