import React, { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import acalaTypes from '@acala-network/types/interfaces/runtime/definitions';

import { loadingSelector } from '@/store/loading/reducer';
import Loading from '@/components/loading';
import Sidebar from './components/side-bar';
import rootActions from '@/store/actions';
import { getEndPoint, sideBarConfig } from '@/config';

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
    const classes = useStyles();
    const loadingStatus = useSelector(loadingSelector(rootActions.chain.CONNECT_ASYNC));

    useEffect(() => {
        dispatch(
            // connect to blockchain
            rootActions.chain.connectAsync.request({
                endpoint: getEndPoint(),
                ...acalaTypes,
            }),
        );
    }, [dispatch]);

    if (loadingStatus) {
        return <Loading />;
    }

    return (
        <div className={classes.root}>
            <Sidebar config={sideBarConfig} />
            <div className={classes.content}>{children}</div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
