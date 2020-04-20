import React, { FC, memo } from 'react';

import { BareProps } from './types';
import classes from './Button.module.scss';
import clsx from 'clsx';

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
  return (
    <button
      className={
        clsx(
          className,
          classes.root,
          classes[size],
          {
            [classes.primary]: primary,
            [classes.normal]: normal
          }
        )
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';