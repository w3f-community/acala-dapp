import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '28px 24px',
        },
        rootLarge: {
            padding: '36px 46px',
        },
        header: {
            paddingBottom: theme.spacing(2),
        },
        headerDivider: {
            borderBottom: `1px solid ${theme.palette.primary.light}`,
        }
    }),
);

type Size = 'normal' | 'large' | 'small';

interface Props {
    size: Size;
    elevation: number;
    header: ReactNode;
    children: ReactNode;
    headerClassName?: string;
    contentClassName?: string;
    divider?: boolean
}

const Card: React.FC<Props> = ({
    header,
    children,
    size = 'normal',
    elevation = 1,
    contentClassName,
    headerClassName,
    divider = true,
}) => {
    const classes = useStyles();
    return (
        <Paper
            square={true}
            elevation={elevation}
            className={clsx({
                [classes.root]: size === 'normal',
                [classes.rootLarge]: size === 'large',
            })}
        >
            <Grid container direction="column">
                <div className={clsx(classes.header, headerClassName, {
                    [classes.headerDivider]: divider
                })}>{header}</div>
                <div className={clsx(contentClassName)}>{children}</div>
            </Grid>
        </Paper>
    );
};

export default Card;
