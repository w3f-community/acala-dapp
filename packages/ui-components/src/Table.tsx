import React, { ReactNode, MouseEvent, EventHandler, useRef, ReactElement } from 'react';
import clsx from 'clsx';

import classes from './Table.module.scss';
import { randomID } from './utils';

type CellAlign = 'left' | 'right' | 'center';

export type TableItem<T> = {
  key?: string;
  title: string;
  dataIndex?: string;
  width?: number;
  align?: CellAlign;
  render?: (...params: any[]) => ReactNode;
};

interface RawProps<T> {
  onClick: (event: MouseEvent<HTMLTableRowElement>, data: T) => void;
}

type Props<T> = {
  config: TableItem<T>[];
  data: (T | any)[];
  rawProps?: RawProps<T>;
  showHeader?: boolean;
  cellClassName?: string;
  empty?: ReactNode;
  size?: 'small' | 'normal'
};

export function Table<T extends { [k: string]: any }> ({
  config,
  data,
  empty,
  rawProps,
  showHeader = false,
  cellClassName,
  size = 'normal'
}: Props<T>): ReactElement {
  const randomId = useRef<string>(randomID());

  const renderItem = (config: TableItem<T>, data: T, index: number): ReactNode => {
    if (!config.render) {
      return config.dataIndex ? data[config.dataIndex] : '';
    }

    if (!config.dataIndex) {
      return config.render(data, index);
    }

    return config.render(data[config.dataIndex], data, index);
  };

  const totalWidthConfiged = config.reduce((acc, cur) => acc + (cur.width ? cur.width : 0), 0);
  const defaultCellWidth = `${100 / config.length}%`;

  return (
    <table className={clsx(classes.root, classes[size])}>
      <colgroup>
        {
          config.map((_item, index) => (
            <col
              key={`table-header-colgroup-${randomId.current}-${index}`}
              style={{ width: _item.width ? `${_item.width / totalWidthConfiged}%` : defaultCellWidth }}
            />
          ))
        }
      </colgroup>
      {
        showHeader ? (
          <thead>
            <tr>
              {config.map((item, index) => (
                <th
                  className={
                    clsx(
                      classes.headerCell,
                      classes[item.align || 'center']
                    )
                  }
                  key={`table-header-${randomId.current}-${index}`}
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
        ) : null
      }
      <tbody>
        {data.map((item, index) => {
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          let onClick: EventHandler<MouseEvent<HTMLTableRowElement>> = () => {};

          if (!item) {
            return null;
          }

          if (rawProps && rawProps.onClick) {
            onClick = (event): void => rawProps.onClick(event, item);
          }

          return (
            <tr
              className={classes.row}
              key={`table-body-${index}`}
              {...rawProps}
              onClick={onClick}
            >
              {config.map((configData, configIndex) => (
                <td
                  className={
                    clsx(
                      classes.cell,
                      classes[configData.align || 'center'],
                      cellClassName,
                      {
                        first: index === 0
                      }
                    )
                  }
                  key={`table-cell-${randomId.current}-${index}-${configData.key || configIndex}`}
                >
                  <div>
                    {
                      renderItem(configData, item, index)
                    }
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      {
        !data.length && empty ? (
          <tr className={classes.empty}>
            <td colSpan={config.length}>{empty}</td>
          </tr>
        ) : null
      }
      </tbody>
    </table>
  );
}
