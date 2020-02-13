import React, { ReactNode } from 'react';
import { Table as UITable, TableHead, TableRow, withStyles, TableCell, Theme, TableBody } from '@material-ui/core';
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
    root: {
        paddingTop: 8,
    },
}))(TableRow);

export type TableItem<T> = {
    title: string;
    renderKey: string;
    render: (text: any, data: T, index: number) => ReactNode;
    [k: string]: string | ReactNode;
};

type Props<T> = {
    config: TableItem<T>[];
    data: (T | null)[];
};

export function Table<T extends { [k: string]: any }>({ config, data }: Props<T>) {
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
                    if (!item) {
                        return null;
                    }
                    return (
                        <StyledTableBodyRow key={`table-body-${index}`}>
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
