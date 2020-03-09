import React, { ReactNode } from 'react';
import { Paper, Grid, Box, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { BaseProps } from '@honzon-platform/apps/types/react-component/props';
import { createTypography } from '@honzon-platform/apps/theme';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
            [theme.breakpoints.down('sm')]: {
                padding: '24px 30px',
            },
            '& $header': {
                ...createTypography(17, 24, 500, 'Roboto', theme.palette.common.black),
                paddingBottom: 8,
                marginBottom: 12,
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
            className={clsx(className, classes.root)}
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
