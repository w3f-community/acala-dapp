import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { transitionsSelector } from '@/store/app/selectors';
import { Grid, Theme, Paper, withStyles, Typography, makeStyles, createStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Tx } from '@/store/types';
import { formatHash } from '@/utils';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
}))(Paper);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginLeft: theme.spacing(2),
        },
    }),
);

const TxStatus: React.FC = () => {
    const classes = useStyles();
    const transitions = useSelector(transitionsSelector);

    const renderTransition = (item: Tx): ReactNode => {
        const actionStrMap = {
            updateVault: 'update vault',
            swapCurrency: 'swap currency',
        };
        return (
            <Grid container direction="column" alignItems="flex-start" className={classes.content}>
                <Grid item>
                    <Typography variant="body1">{actionStrMap[item.type]}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">tx: {formatHash(item.hash)}</Typography>
                </Grid>
            </Grid>
        );
    };

    const renderIcon = (item: Tx) => {
        if (item.status === 'pending') {
            return <CircularProgress size={28} />;
        }
        if (item.status === 'success') {
            return <CheckCircleIcon color="action" fontSize="large" />;
        }
        if (item.status === 'failure') {
            return <WarningIcon color="error" fontSize="large" />;
        }
    };

    return (
        <div>
            {transitions.map(item => (
                <SPaper elevation={1} key={`transition-${item.hash}-${item.status}`}>
                    <Grid container alignItems="center">
                        {renderIcon(item)}
                        <Grid item xs={10}>
                            {renderTransition(item)}
                        </Grid>
                    </Grid>
                </SPaper>
            ))}
        </div>
    );
};
export default TxStatus;
