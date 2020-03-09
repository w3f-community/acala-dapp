import React, { FC, ChangeEvent } from 'react';
import { Tabs as MTabs, Tab, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@honzon-platform/apps/theme';

const STabs = withStyles((theme: Theme) => ({
    root: {
        marginBottom: 26,
    },
    indicator: {
        backgroundColor: theme.palette.primary.light,
    },
}))(MTabs);

const STab = withStyles((theme: Theme) => ({
    root: {
        minWidth: 'auto',
        padding: '0 3.5px',
        marginRight: 26,
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        textTransform: 'none',
        ...createTypography(22, 26, 500, 'Roboto', theme.palette.common.black),
        '&$selected': {
            color: theme.palette.secondary.main,
        },
    },
}))(Tab);

export interface TabsItem {
    key: string;
    title: string;
    render: FC<{}>;
}

interface Props {
    active: string;
    config: TabsItem[];
    onChange: (value: string) => void;
}

export const Tabs: FC<Props> = ({ active, config, onChange }) => {
    const handleChange: (event: ChangeEvent<{}>, value: any) => void = (_, value) => {
        onChange(value);
    };
    const activeItem = config.find(item => item.key === active);

    return (
        <>
            <STabs value={active} onChange={handleChange}>
                {config.map(item => (
                    <STab label={item.title} value={item.key} key={`tabs-${item.key}`} />
                ))}
            </STabs>
            {activeItem && activeItem!.render({})}
        </>
    );
};
