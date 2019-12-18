import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
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
