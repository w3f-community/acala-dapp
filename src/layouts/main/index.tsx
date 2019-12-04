import React, { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import acalaTypes from '@acala-network/types/interfaces/runtime/definitions';

import Sidebar from '@/components/side-bar';
import rootActions from '@/store/actions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            background: theme.palette.background.default,
        },
        content: {
            flexGrow: 1,
            padding: '46px 46px 46px 55px',
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
        },
    }),
);

interface Props {
    children: ReactNode;
}

const MainLayout: React.FC<Props> = props => {
    const { children } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            rootActions.chain.connectAsync.request({
                endpoint: 'wss://39.99.168.67/wss',
                ...acalaTypes,
            }),
        );
    }, [dispatch]);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Sidebar />
            <div className={classes.content}>{children}</div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
