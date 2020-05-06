import React, { FC } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import { Loading } from './Loading';
import classes from './Button.module.scss';
import { IconType, getIcon } from './Icon';

type ButtonType = 'normal' | 'ghost' | 'border';
type ButtonColor = 'normal' | 'primary' | 'danger';
type ButtonSize = 'small' | 'middle' | 'large';

export interface ButtonProps extends BareProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: ButtonType;
  color?: ButtonColor;
  size?: ButtonSize;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  color = 'normal',
  disabled,
  loading,
  onClick,
  size = 'middle',
  type = 'normal'
}) => {
  const _onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    // handle disabled/loading status
    if (disabled || loading) {
      return;
    }

    onClick && onClick(event);
  };

  return (
    <button
      className={
        clsx(
          className,
          classes.root,
          classes[size],
          classes['type-' + type],
          classes['color-' + color],
          {
            [classes.disabled]: disabled
          }
        )
      }
      onClick={_onClick}
    >
      {
        loading ? (
          <Loading
            className={classes.loading}
            size={18}
          />
        ) : null
      }
      {children}
    </button>
  );
};

interface IconButtonProps extends ButtonProps {
  icon: IconType;
}

export const IconButton: FC<IconButtonProps> = ({
  className,
  icon,
  ...other
}) => {
  return (
    <Button
      className={
        clsx(
          className,
          classes.iconButton
        )
      }
      {...other}
    >
      { getIcon(icon) }
    </Button>
  );
};
