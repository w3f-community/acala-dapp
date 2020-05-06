import React, { InputHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';

import classes from './Input.module.scss';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  error?: boolean;
  size?: 'small' | 'large' | 'normal';
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export const Input: FC<Props> = ({
  className,
  error,
  prefix,
  size = 'normal',
  suffix,
  ...other
}) => {
  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          classes[size],
          {
            [classes.error]: error
          }
        )
      }
    >
      {prefix ? <span>{prefix}</span> : null}
      <input
        className={classes.input}
        {...other}
      />
      {suffix ? <span>{suffix}</span> : null}
    </div>
  );
};
