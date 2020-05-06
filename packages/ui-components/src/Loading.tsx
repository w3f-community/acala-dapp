import React, { FC } from 'react';
import classes from './Loading.module.scss';
import { BareProps } from './types';
import clsx from 'clsx';

interface Props extends BareProps {
  size?: number;
}

export const Loading: FC<Props> = ({
  className,
  size = 40
}) => {
  const style = {
    height: size,
    width: size
  };

  return (
    <div
      className={
        clsx(
          classes.root,
          className
        )
      }
      style={style}
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
