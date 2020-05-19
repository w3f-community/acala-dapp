import React, { InputHTMLAttributes, FC, ReactNode, useState, FocusEventHandler } from 'react';
import clsx from 'clsx';

import classes from './Input.module.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  error?: boolean;
  size?: 'small' | 'large' | 'normal';
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export const Input: FC<InputProps> = ({
  className,
  error,
  prefix,
  size = 'normal',
  suffix,
  ...other
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(true);
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(false);
  };

  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          classes[size],
          {
            [classes.focused]: focused,
            [classes.error]: error
          }
        )
      }
    >
      {prefix ? <span>{prefix}</span> : null}
      <input
        className={classes.input}
        onBlur={onBlur}
        onFocus={onFocus}
        {...other}
      />
      {suffix ? <span>{suffix}</span> : null}
    </div>
  );
};
