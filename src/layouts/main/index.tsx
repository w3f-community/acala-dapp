import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import acalaTypes from '@acala-network/types/interfaces/runtime/definitions';

import rootActions from '@/store/actions';

interface Props {
    children: ReactNode,
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: theme.palette.background.default,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
}));

const MainLayout: React.FC<Props> = props => {
    const { children } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            rootActions.chain.connectAsync.request({
                endpoint: 'ws://127.0.0.1:9944',
                ...acalaTypes
            })
        );
    }, [dispatch]);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                {children}
            </div>
        </div>
    );
}

export default MainLayout;
