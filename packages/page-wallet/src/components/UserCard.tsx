import React, { FC, ReactNode } from 'react';
import Identicon from '@polkadot/react-identicon';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Card, Loading, CopyIcon, Button } from '@acala-dapp/ui-components';

import { useAccounts, useNotification } from '@acala-dapp/react-hooks';
import classes from './UserCard.module.scss';
import { FormatAddress } from '@acala-dapp/react-components';

export const UserCard: FC = () => {
  const { active, openSelectAccount } = useAccounts();
  const { createNotification } = useNotification();

  const renderContent = (): ReactNode => {
    if (!active) {
      return null;
    }

    const handleCopy = (): void => {
      createNotification({
        icon: 'success',
        removedDelay: 2000,
        title: 'Copy Success',
        type: 'success'
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
      padding={false}
    >
      {active ? renderContent() : <Loading />}
    </Card>
  );
};
