import React, { ReactNode, MouseEvent, EventHandler, useRef, ReactElement } from 'react';
import { Table as SUTable, TableRowProps, TableCellProps } from 'semantic-ui-react';
import clsx from 'clsx';

import { randomID } from './utils';

export type TableItem<T> = {
  title: string;
  dataIndex?: string;
  render?: (...params: any[]) => ReactNode;
  cellProps?: TableCellProps;
};

interface RawProps<T> extends Omit<TableRowProps, 'onClick'> {
  onClick: (event: MouseEvent<HTMLTableRowElement>, data: T) => void;
}

type Props<T> = {
  config: TableItem<T>[];
  data: (T | null)[];
  rawProps?: RawProps<T>;
  showHeader?: boolean;
};

export function Table<T extends { [k: string]: any }> ({
  config,
  data,
  rawProps,
  showHeader = false
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

  return (
    <SUTable>
      {
        showHeader ? (
          <SUTable.Header>
            <SUTable.Row>
              {config.map((item, index) => (
                <SUTable.HeaderCell key={`table-header-${randomId.current}-${index}`}>
                  {item.title}
                </SUTable.HeaderCell>
              ))}
            </SUTable.Row>
          </SUTable.Header>
        ) : null
      }
      <SUTable.Body>
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
            <SUTable.Row
              key={`table-body-${index}`}
              {...rawProps}
              onClick={onClick}
            >
              {config.map((configData, configIndex) => (
                <SUTable.Cell
                  className={clsx({ first: index === 0 })}
                  key={`table-cell-${randomId.current}-${index}-${configIndex}`}
                  {...configData.cellProps}
                >
                  {
                    renderItem(configData, item, configIndex)
                  }
                </SUTable.Cell>
              ))}
            </SUTable.Row>
          );
        })}
      </SUTable.Body>
    </SUTable>
  );
}
