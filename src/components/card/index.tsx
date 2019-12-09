import React, { ReactNode } from 'react';
import { Paper, Grid, Box } from '@material-ui/core';
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
        },
    }),
);

type Size = 'normal' | 'large' | 'small';

interface Props {
    size: Size;
    elevation: number;
    header: ReactNode;
    children: ReactNode;
    contentPadding?: number;
    headerClassName?: string;
    contentClassName?: string;
    divider?: boolean;
}

const Card: React.FC<Props> = ({
    header,
    children,
    size = 'normal',
    elevation = 1,
    headerClassName,
    contentPadding = 2,
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
                <div
                    className={clsx(classes.header, headerClassName, {
                        [classes.headerDivider]: divider,
                    })}
                >
                    {header}
                </div>
                <Box paddingTop={contentPadding}>{children}</Box>
            </Grid>
        </Paper>
    );
};

export default Card;
