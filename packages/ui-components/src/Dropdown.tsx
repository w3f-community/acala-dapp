import React, { memo, FC, ReactNode, useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as ArrowDownIcon } from './assets/arrow-down.svg';
import { BareProps } from './types';
import classes from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  render: () => ReactNode;
}

interface Props extends BareProps {
  value?: string;
  onChange: (value: string | any) => void;
  placeholder: string;
  options: DropdownOption[];
}

export const Dropdown: FC<Props> = memo(({
  value,
  placeholder,
  onChange,
  options
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const active = options.find((data: DropdownOption) => data.value === value);
  const closeMenu = (): void => {
    setOpen(false);
  };
  const toggleMenu = (): void => {
    setOpen(!open);
  };
  const onItemSelect = (value: string): void => {
    onChange(value);
    closeMenu();
  }

  return (
    <div className={clsx(classes.root, { [classes.open]: open})}>
      <div className={classes.activeRoot} onClick={toggleMenu}>
        <div className={classes.activeContent}>
          {active ? active.render() : placeholder}
        </div>
        <div className={classes.activeAction}>
          <ArrowDownIcon />
        </div>
      </div>
      <ul className={classes.menu}>
        {options.map((item: DropdownOption) => {
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