import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { transactionsSelector } from '@/store/app/selectors';
import { Grid, Theme, Slide, Typography, makeStyles, createStyles, Snackbar } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Tx } from '@/types/store';
import { formatHash } from '@/utils';
import { green } from '@material-ui/core/colors';
import TxDetail from '../tx-detail';

function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.common.white,
        },
        content: {
            marginLeft: theme.spacing(2),
        },
        success: {
            color: green[600],
        },
        spin: {
            width: 26,
            height: 26,
        },
    }),
);

const TxStatus: React.FC = () => {
    const classes = useStyles();
    const transactions = useSelector(transactionsSelector);

    const renderTransition = (item: Tx): ReactNode => {
        return (
            <Grid container direction="column" alignItems="flex-start" className={classes.content}>
                <Grid item>
                    <Typography variant="h2">
                        <TxDetail data={item} />
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">tx: {formatHash(item.hash)}</Typography>
                </Grid>
            </Grid>
        );
    };

    const renderIcon = (item: Tx) => {
        if (item.status === 'pending') {
            return <CircularProgress size={26} classes={{ svg: classes.spin }} />;
        }
        if (item.status === 'success') {
            return <CheckCircleIcon className={classes.success} fontSize="large" />;
        }
        if (item.status === 'failure') {
            return <WarningIcon color="error" fontSize="large" />;
        }
    };

    return (
        <div>
            {transactions.map(item => (
                <Snackbar
                    key={`${item.hash}-${item.status}`}
                    ContentProps={{
                        className: classes.root,
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    TransitionComponent={SlideTransition}
                    open={true}
                    message={
                        <Grid container alignItems="center" wrap="nowrap">
                            {renderIcon(item)}
                            {renderTransition(item)}
                        </Grid>
                    }
                />
            ))}
        </div>
    );
};
export default TxStatus;
