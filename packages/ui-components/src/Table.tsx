import React, { ReactNode, MouseEvent, EventHandler, useRef, ReactElement, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import classes from './Table.module.scss';
import { randomID } from './utils';
import { PageLoading } from './Loading';

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
  loading?: boolean;
};

export function Table<T extends { [k: string]: any }> ({
  config,
  data,
  empty,
  rawProps,
  showHeader = false,
  cellClassName,
  size = 'normal',
  loading = false
}: Props<T>): ReactElement {
  const randomId = useRef<string>(randomID());
  const totalWidthConfiged = useMemo(() => config.reduce((acc, cur) => acc + (cur.width ? cur.width : 0), 0), [config]);
  const defaultCellWidth = useMemo(() => `${100 / config.length}%`, [config]);

  const renderItem = useCallback((config: TableItem<T>, data: T, index: number): ReactNode => {
    if (!config.render) {
      return config.dataIndex ? data[config.dataIndex] : '';
    }

    if (!config.dataIndex) {
      return config.render(data, index);
    }

    return config.render(data[config.dataIndex], data, index);
  }, [config]);

  const renderContent = useCallback(() => {
    if (loading && !data) {
      return (
        <tr className={classes.empty}>
          <td colSpan={config.length}>
            <PageLoading />
          </td>
        </tr> 
      );
    }

    if (data) {
      return data.map((item, index) => {
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
        });
    }

    if (!data && empty) {
      return (
        <tr className={classes.empty}>
          <td colSpan={config.length}>{empty}</td>
        </tr>
      );
    }
  }, [loading, data, config]);

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
        {
          renderContent()
        }      
      </tbody>
    </table>
  );
}
