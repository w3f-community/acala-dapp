import React, { FC, ReactNode, memo } from 'react';
import classes from './List.module.scss';
import clsx from 'clsx';

type ListData = {
  [k in string]: any
}

export interface ListConfig {
  key: string;
  title: string;
  render: (data: any, index: number) => ReactNode;
}

interface Props {
  config: ListConfig[];
  data: ListData;
  itemClassName?: string;
}

export const List: FC<Props> = memo(({
  config,
  data,
  itemClassName
}) => {
  return (
    <ul className={classes.root}>
      {
        Object.keys(data).map((key, index) => {
          const _config = config[index];

          return (
            <li
              className={clsx(classes.listItem,  itemClassName)}
              key={`list-${key}-${index}`}
            >
              <div>{_config.title}</div>
              <div>{_config.render(data[key], index)}</div>
            </li>
          );
        })
      }
    </ul>
  );
});

List.displayName = 'List';
