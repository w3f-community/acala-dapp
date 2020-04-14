import React, { FC, memo } from 'react';
import { Loader } from 'semantic-ui-react';
import classes from './FullScreenLoading.module.scss';

export const FullScreenLoading: FC = memo(() => {
  return (
    <div className={classes.root}>
      <Loader className={classes.loader} />
    </div>
  );
});

FullScreenLoading.displayName = 'FullScreenLoading';
