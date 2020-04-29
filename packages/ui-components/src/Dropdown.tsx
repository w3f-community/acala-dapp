import React, { memo, FC, ReactNode, useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as ArrowDownIcon } from './assets/arrow-down.svg';
import { BareProps } from './types';
import classes from './Dropdown.module.scss';

export interface DropdownConfig {
  value: any;
  render: () => ReactNode;
}

interface Props extends BareProps {
  size: 'small' | 'normal';
  value?: any;
  onChange: (value: string | any) => void;
  placeholder?: string;
  config: DropdownConfig[];
  error?: boolean;
  border?: boolean;
}

export const Dropdown: FC<Props> = memo(({
  className,
  config,
  size = 'normal',
  value,
  placeholder,
  onChange,
  border = true
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const active = config.find((data: DropdownConfig) => data.value === value);

  const closeMenu = (): void => {
    setOpen(false);
  };

  const toggleMenu = (): void => {
    setOpen(!open);
  };

  const onItemSelect = (value: string): void => {
    onChange(value);
    closeMenu();
  };

  return (
    <div
      className={
        clsx(classes.root,
          className,
          {
            [classes.open]: open,
            [classes.small]: size === 'small',
            [classes.border]: border,
            [classes.normal]: !border
          }
        )
      }
    >
      <div className={classes.activeRoot} onClick={toggleMenu}>
        <div className={classes.activeContent}>
          {active ? active.render() : placeholder}
        </div>
        <div className={classes.activeAction}>
          <ArrowDownIcon />
        </div>
      </div>
      <ul className={classes.menu}>
        {config.map((item: DropdownConfig) => {
          return (
            <li
              key={`dropdown-${item.value}`}
              onClick={() => onItemSelect(item.value)}
              className={classes.menuItem}
            >
              {item.render()}
            </li>
          );
        })}
      </ul>
    </div>
  );
});