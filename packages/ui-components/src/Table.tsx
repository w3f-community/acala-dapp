import React, { ReactNode, MouseEvent, EventHandler, useRef } from 'react';
import { Table as SUTable, TableRowProps, TableCellProps} from 'semantic-ui-react';
import clsx from 'clsx';
import { render } from '@testing-library/react';
import { randomID } from './utils';

interface RenderCB<T> {
  (data: any, rowData: T, index?: number): ReactNode;
  (rowData: T, index?: number): ReactNode;
}

export type TableItem<T> = {
  title: string;
  dataIndex?: string;
  render?: RenderCB<T>;
  cellProps?: TableCellProps;
};

interface RawProps<T> extends Omit<TableRowProps, 'onClick'> {
  onClick: (event: MouseEvent<HTMLTableRowElement>, data: T) => void;
}

type Props<T> = {
  config: TableItem<T>[];
  data: (T | null)[];
  rawProps?: RawProps<T>;
};

export function Table<T extends { [k: string]: any }>({
  config,
  data,
  rawProps
}: Props<T>) {
  const randomId = useRef<string>(randomID());
  const renderItem = (config: TableItem<T>, data: T, index: number): ReactNode => {
    if (!config.render) {
      return config.dataIndex ? data[config.dataIndex] : '';
    }
    if (!config.dataIndex) {
      return config.render(data, index);
    }
    return config.render(data[config.dataIndex], data, index);
  }
  return (
    <SUTable celled>
      <SUTable.Header>
        <SUTable.Row>
          {config.map((item, index) => (
            <SUTable.HeaderCell key={`table-header-${randomId.current}-${index}`}>
              {item.title}
            </SUTable.HeaderCell>
          ))}
        </SUTable.Row>
      </SUTable.Header>
      <SUTable.Body>
        {data.map((item, index) => {
          /* eslint-disable-next-line @typescript-eslint/no-empty-function */
          let onClick: EventHandler<MouseEvent<HTMLTableRowElement>> = () => {};
          if (!item) {
            return null;
          }
          if (rawProps && rawProps.onClick) {
            onClick = event => rawProps.onClick(event, item);
          }
          return (
            <SUTable.Row
              key={`table-body-${index}`}
              {...rawProps}
              onClick={onClick}
            >
              {config.map((configData, configIndex) => (
                <SUTable.Cell
                  key={`table-cell-${randomId.current}-${index}-${configIndex}`}
                  className={clsx({ first: index === 0 })}
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
