import React, { ReactNode } from 'react';
import { Paper, Grid, Box, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '24px 26px',
            [theme.breakpoints.down('sm')]: {
                padding: '24px 30px',
            },
        },
        rootLarge: {
            padding: '32px 26px',
            [theme.breakpoints.down('sm')]: {
                padding: '32px 30px',
            },
        },
        header: {
            paddingBottom: 26,
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
    children: ReactNode;
    contentPadding?: number;
    headerClassName?: string;
    contentClassName?: string;
    header?: ReactNode;
    divider?: boolean;
    marginTop?: number;
}

const Card: React.FC<Props> = ({
    header,
    children,
    size = 'normal',
    elevation = 1,
    headerClassName,
    contentPadding = 2,
    divider = true,
    marginTop = 0,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <Paper
            square={true}
            elevation={elevation}
            className={clsx({
                [classes.root]: size === 'normal',
                [classes.rootLarge]: size === 'large',
            })}
            style={{ marginTop: theme.spacing(marginTop) }}
        >
            <Grid container direction="column">
                {header && (
                    <div
                        className={clsx(classes.header, headerClassName, {
                            [classes.headerDivider]: divider,
                        })}
                    >
                        {header}
                    </div>
                )}
                <Box>{children}</Box>
            </Grid>
        </Paper>
    );
};

export default Card;
