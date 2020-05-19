import React, { FC } from 'react';
import clsx from 'clsx';

import { InputProps, Input } from './Input';
import classes from './TagInput.module.scss';

interface Props extends InputProps{
  label: string;
}

export const TagInput: FC<Props> = ({
  className,
  error,
  label,
  ...inputProps
}) => {
  return (
    <div
      className={
        clsx(
          className,
          classes.root,
          {
            [classes.error]: error
          }
        )
      }
    >
      <Input {...inputProps}
        className={classes.input} />
      {label ? <span>{label}</span> : null}
    </div>
  );
};
