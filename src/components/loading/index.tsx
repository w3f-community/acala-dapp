import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            width: '100vw',
            height: '100vh',
        },
    }),
);

const Loading: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );
};

export default Loading;
