import React, { memo, FC, ReactNode, useState, useRef, createRef, useEffect } from 'react';
import clsx from 'clsx';

import { ReactComponent as ArrowDownIcon } from './assets/arrow-down.svg';
import { BareProps } from './types';
import classes from './Dropdown.module.scss';

export interface DropdownConfig {
  value: any;
  render: () => ReactNode;
}

interface Props extends BareProps {
  size?: 'small' | 'normal';
  value?: any;
  onChange: (value: string | any) => void;
  placeholder?: string;
  config: DropdownConfig[];
  error?: boolean;
  border?: boolean;
  menuClassName?: string;
  itemClassName?: string;
  arrowClassName?: string;
  activeContentClassName?: string;
  selectedRender?: (value: any) => ReactNode;
}

export const Dropdown: FC<Props> = memo(({
  border = true,
  className,
  config,
  menuClassName,
  itemClassName,
  arrowClassName,
  activeContentClassName,
  onChange,
  placeholder,
  selectedRender,
  size = 'normal',
  value
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const $rootRef = createRef<HTMLDivElement>();
  const active = config.find((data: DropdownConfig) => data.value === value);

  useEffect(() => {
    if (!$rootRef.current) {
      return;
    }
    const $root = $rootRef.current;

    $root.querySelectorAll('li').forEach(($item): void => {
      $item.style.height = getComputedStyle($root).height;
    });
  }, [$rootRef]);

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

  const renderSelected = (): ReactNode => {
    if (!active) {
      return placeholder;
    }

    if (selectedRender) {
      return selectedRender(active.value);
    }

    return active.render();
  };

  return (
    <div
      ref={$rootRef}
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
      <div
        className={classes.activeRoot}
        onClick={toggleMenu}
      >
        <div className={clsx(classes.activeContent, activeContentClassName)}>
          {renderSelected()}
        </div>
        <div className={clsx(classes.arrow, arrowClassName)}>
          <ArrowDownIcon />
        </div>
      </div>
      <ul className={clsx(classes.menu, menuClassName)}>
        {config.map((item: DropdownConfig): ReactNode => {
          return (
            <li
              className={clsx(classes.menuItem, itemClassName)}
              key={`dropdown-${item.value}`}
              onClick={() => onItemSelect(item.value)}
            >
              {item.render()}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
