import React, { ReactNode, MouseEvent, EventHandler } from 'react';
import {
    Table as UITable,
    TableHead,
    TableRow,
    withStyles,
    TableCell,
    Theme,
    TableBody,
    TableRowProps,
} from '@material-ui/core';
import { createTypography } from '@/theme';
import clsx from 'clsx';

const StyledBodyCell = withStyles((theme: Theme) => ({
    root: {
        paddingTop: 4,
        paddingBottom: 4,
        borderBottom: 'none',
        color: theme.palette.text.secondary,
        '&.first': {
            paddingTop: 12,
        },
    },
}))(TableCell);

const StyledHeaderCell = withStyles((theme: Theme) => ({
    root: {
        paddingTop: 0,
        paddingBottom: 8,
        marginBottom: 12,
        color: theme.palette.common.black,
        borderBottom: `1px solid ${theme.palette.secondary.main}`,
        ...createTypography(15, 22, 500, 'Roboto'),
    },
}))(TableCell);

const StyledTableBodyRow = withStyles(() => ({
    root: { paddingTop: 8 },
    selected: {}, // Pseudo-classe for user custom
    hover: {}, // Pseudo-classes for user custom
    head: {}, // Pseudo-classes for user custom
    footer: {}, // Pseudo-classes for user custom
}))(TableRow);

export type TableItem<T> = {
    title: string;
    renderKey: string;
    render: (text: any, data: T, index: number) => ReactNode;
    [k: string]: string | ReactNode;
};

interface RawProps<T> extends Omit<TableRowProps, 'onClick'> {
    onClick: (event: MouseEvent<HTMLTableRowElement>, data: T) => void;
}

type Props<T> = {
    config: TableItem<T>[];
    data: (T | null)[];
    rawProps?: RawProps<T>;
};

export function Table<T extends { [k: string]: any }>({ config, data, rawProps }: Props<T>) {
    return (
        <UITable>
            <TableHead>
                <TableRow>
                    {config.map(item => (
                        <StyledHeaderCell key={`table-header-${item.renderKey}`}>{item.title}</StyledHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody style={{ paddingTop: 8 }}>
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
                        <StyledTableBodyRow key={`table-body-${index}`} {...rawProps} onClick={onClick}>
                            {config.map((configItem, configIndex) => (
                                <StyledBodyCell
                                    key={`table-cell-${index}-${configItem.renderKey}`}
                                    className={clsx({ first: index === 0 })}
                                >
                                    {config[configIndex]
                                        ? config[configIndex].render(item[configItem.renderKey], item, index)
                                        : null}
                                </StyledBodyCell>
                            ))}
                        </StyledTableBodyRow>
                    );
                })}
            </TableBody>
        </UITable>
    );
}
