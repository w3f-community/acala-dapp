import React, { memo, FC, ReactNode } from 'react';
import Identicon from '@polkadot/react-identicon';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Card, Loading, CopyIcon, Button } from '@honzon-platform/ui-components';

import { useAccounts, useNotification } from '@honzon-platform/react-hooks';
import classes from './UserCard.module.scss';
import { FormatAddress } from '@honzon-platform/react-components';

export const UserCard: FC = memo(() => {
  const { active, openSelectAccount } = useAccounts();
  const { createNotification } = useNotification();

  const renderContent = (): ReactNode => {
    if (!active) {
      return null;
    }

    const handleCopy = (): void => {
      createNotification({
        icon: 'success',
        type: 'success',
        title: 'Copy Success',
        removedDelay: 2000,
        placement: 'top right'
      });
    };

    return (
      <>
        <Identicon
          className={classes.icon}
          size={64}
          theme='substrate'
          value={active.address}
        />
        <div className={classes.info}>
          <div className={classes.name}>
            {active.meta.name || 'User'}
            <Button
              color='primary'
              onClick={openSelectAccount}
              type='ghost'
            >
            change
            </Button>
          </div>
          <FormatAddress
            address={active.address}
            className={classes.address}
          />
        </div>
        <CopyToClipboard
          onCopy={handleCopy}
          text={active.address}
        >
          <div className={classes.copy}>
            <CopyIcon />
          </div>
        </CopyToClipboard>
      </>
    );
  };

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      gutter={false}
    >
      {active ? renderContent() : <Loading />}
    </Card>
  );
});
