import React, { FC, ReactNode, memo } from 'react';
import clsx from 'clsx';

import classes from './List.module.scss';
import { BareProps } from './types';

type ListData = {
  [k in string]: any
}

export interface ListConfig {
  key: string;
  title: string;
  render: (data: any, index: number) => ReactNode;
}

interface Props extends BareProps {
  config: ListConfig[];
  data: ListData;
  itemClassName?: string;
}

export const List: FC<Props> = memo(({
  className,
  config,
  data,
  itemClassName
}) => {
  return (
    <ul className={clsx(classes.root, className)}>
      {
        config.map((_config, index): ReactNode => {
          const { key } = _config;

          return (
            <li
              className={clsx(classes.listItem, itemClassName)}
              key={`list-${key}-${index}`}
            >
              <div className='aca-list--label'>{_config.title}</div>
              <div className='aca-list--value'>{_config.render(data[key], index)}</div>
            </li>
          );
        })
      }
    </ul>
  );
});

List.displayName = 'List';
