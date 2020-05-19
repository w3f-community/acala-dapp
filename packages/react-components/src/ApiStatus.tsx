import React, { FC, memo } from 'react';

import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

import classes from './ApiStatus.module.scss';
import clsx from 'clsx';

export const ApiStatus: FC<BareProps> = memo(({ className }) => {
  const { connected, error, loading } = useApi();

  const getStatusText = (): string => {
    if (loading) {
      return 'Connecting';
    }

    if (error) {
      return 'Error';
    }

    if (connected) {
      return 'Connected';
    }

    return '';
  };

  return (
    <p className={
      clsx(
        className,
        classes.root,
        {
          [classes.connected]: connected,
          [classes.error]: error,
          [classes.loading]: loading
        }
      )
    }>
      {getStatusText()}
    </p>
  );
});

ApiStatus.displayName = 'ApiStatus';
