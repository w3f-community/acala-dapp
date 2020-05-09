import React, { FC } from 'react';
import classes from './Loading.module.scss';
import { BareProps } from './types';
import clsx from 'clsx';

interface Props extends BareProps {
  size?: 'normal' | 'small';
}

export const Loading: FC<Props> = ({
  className,
  size = 'normal'
}) => {
  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          classes[size]
        )
      }
    >
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
};
