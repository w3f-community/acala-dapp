import React, { FC, memo } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Button.module.scss';

interface Props extends BareProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  primary?: boolean;
  normal?: boolean;
  size?: 'large' | 'small'
}

export const Button: FC<Props> = memo(({
  children,
  className,
  loading,
  disabled,
  onClick,
  primary = true,
  normal = false,
  size = 'large'
}) => {
  const _onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // handle disabled status
    if (disabled) {
      return;
    }
    onClick && onClick(event);
  }

  return (
    <button
      className={
        clsx(
          className,
          classes.root,
          classes[size],
          {
            [classes.primary]: primary,
            [classes.normal]: normal,
            [classes.disabled]: disabled
          }
        )
      }
      onClick={_onClick}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';