import React from 'react';
import { Grid, Paper, Typography, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import Formatter, { FormatterProps } from '@/components/formatter';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        flex: '1 1 auto',
        padding: '26px 32px',

        '&:last-child': {
            marginRight: 0,
        },

        [theme.breakpoints.down('sm')]: {
            padding: '3px 32px',
        },
        '& .MuiGrid-root': {
            height: '100%',
        },
    },
}))(Paper);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.down('sm')]: {
                paddingTop: 22,
                paddingBottom: 27,
            },
        },
        card: {
            minWidth: 154,
            width: '19%',
            marginBottom: '1%',
            flexGrow: 0,
            flexShrink: 0,
            '&:last-child': {
                marginRight: 0,
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        content: {
            marginTop: 22,
        },
    }),
);

type CardProps = {
    header: string;
    content: FixedU128;
    formatterProps: Omit<FormatterProps, 'data'>;
    className?: string;
    elevation?: number;
};

export const DigitalCard: React.FC<CardProps> = ({ className, header, content, formatterProps, elevation = 2 }) => {
    const match = useMobileMatch('sm');
    const classes = useStyles();
    return (
        <SPaper elevation={match ? 0 : elevation} square={true} className={clsx(classes.card, className)}>
            <Grid
                container
                direction={match ? 'row' : 'column'}
                justify="space-between"
                alignItems="center"
                wrap="nowrap"
            >
                <Typography variant="body2">{header}</Typography>
                <Typography variant="body1" className={classes.content}>
                    <Formatter data={content} {...formatterProps} />
                </Typography>
            </Grid>
        </SPaper>
    );
};
