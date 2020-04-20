import React, { FC, memo } from 'react';
import classes from './Loading.module.scss';

export const Loading: FC = memo(() => {
  return (
    <div className={classes.root}>
      <div className={classes.loader} />
    </div>
  );
});

Loading.displayName = 'Loading';
