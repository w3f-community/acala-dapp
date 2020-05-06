import React, { FC, memo, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import classes from './Radio.module.scss';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  label?: ReactNode;
  checked?: boolean;
  onClick?: () => void;
}

export const Radio: FC<Props> = memo(({
  checked = false,
  className,
  label,
  onClick,
  ...other
}) => {
  return (
    <label
      className={
        clsx(
          classes.root,
          className,
          {
            [classes.checked]: checked
          }
        )
      }
      onClick={onClick}
    >
      <span className={classes.radio}>
        <input
          className={classes.input}
          {...other}
        />
      </span>
      {label ? <div className={classes.label}>{label}</div> : null}
    </label>
  );
});

Radio.displayName = 'Radio';
