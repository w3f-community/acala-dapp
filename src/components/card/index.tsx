import React, { ReactNode } from 'react';
import { Paper, Grid, Box, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { BaseProps } from '@/types/react-component/props';
import { createTypography } from '@/theme';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '24px 26px',
            [theme.breakpoints.down('sm')]: {
                padding: '24px 30px',
            },
            '& $header': {
                ...createTypography(18, 22, 500, 'Roboto', theme.palette.common.black),
                paddingBottom: 16.5,
                marginBottom: 18.5,
            },
        },
        rootLarge: {
            padding: '32px 26px',
            [theme.breakpoints.down('sm')]: {
                padding: '32px 30px',
            },
            '& $header': {
                paddingBottom: 8.5,
                marginBottom: 18.5,
            },
        },
        header: {},
        headerDivider: {
            borderBottom: `1px solid ${theme.palette.primary.light}`,
        },
    }),
);

type Size = 'normal' | 'large' | 'small';

type Props = {
    size: Size;
    elevation: number;
    children: ReactNode;
    headerClassName?: string;
    contentClassName?: string;
    header?: ReactNode;
    divider?: boolean;
    marginTop?: number;
} & BaseProps;

const Card: React.FC<Props> = ({
    header,
    children,
    size = 'normal',
    elevation = 1,
    headerClassName,
    divider = true,
    marginTop = 0,
    className,
    style,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <Paper
            square={true}
            elevation={elevation}
            className={clsx(className, {
                [classes.root]: size === 'normal',
                [classes.rootLarge]: size === 'large',
            })}
            style={{ marginTop: theme.spacing(marginTop), ...style }}
        >
            <Grid container direction="column" wrap="nowrap">
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
