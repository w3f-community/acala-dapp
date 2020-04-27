import React, { FC } from 'react';
import classes from './Loading.module.scss';

export const Loading: FC = () => {
  return (
    <div className={classes.root}>
      <div className={classes.loader} />
    </div>
  );
};

export const FullLoading: FC = () => {
  return (
    <div className={classes.fullscreen}>
      <Loading/>
    </div>
  );
}
