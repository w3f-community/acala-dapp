import React, { FC, ReactNode, memo } from 'react';
import classes from './List.module.scss';

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
}

export const List: FC<Props> = memo(({ config, data }) => {
  return (
    <ul className={classes.root}>
      {
        Object.keys(data).map((key, index) => {
          const _config = config[index];
          return (
            <li key={`list-${key}-${index}`} className={classes.listItem}>
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
