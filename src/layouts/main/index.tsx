import React, { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeStyles,
    createStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    useMediaQuery,
} from '@material-ui/core';
import { Theme, useTheme } from '@material-ui/core/styles';
import acalaTypes from '@acala-network/types/src/interfaces/runtime/definitions';

import { loadingSelector } from '@/store/loading/reducer';
import Loading from '@/components/loading';
import actions from '@/store/actions';
import { getEndPoint, sideBarConfig } from '@/config';
import { connectedSelector } from '@/store/chain/selectors';
import { extensionStatusSelector } from '@/store/account/selectors';
import Header from './components/header';
import Sidebar from './components/side-bar';
import NoExtension from './components/no-extension';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            background: theme.palette.background.default,
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            }
        },
        content: {
            flexGrow: 1,
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
    const connectLoading = useSelector(loadingSelector(actions.chain.CONNECT_ASYNC));
    const importAccountLoading = useSelector(loadingSelector(actions.account.IMPORT_ACCOUNT));
    const extensionStatus = useSelector(extensionStatusSelector);
    // const connectStatus = useSelector(connectedSelector);
    const theme = useTheme();
    const match = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(
            // connect to blockchain
            actions.chain.connectAsync.request({ endpoint: getEndPoint(), ...acalaTypes }),
        );
        dispatch(actions.account.importAccount.request(''));
    }, [dispatch]);

    const renderContent = () => {
        if (connectLoading || importAccountLoading) {
            return <Loading />;
        }

        if (extensionStatus === 'none' || extensionStatus === 'failure') {
            return null;
        }

        return <div className={classes.content}>{children}</div>;
    };

    return (
        <div className={classes.root}>
        {
            match ? <Header/> : <Sidebar config={sideBarConfig} />
        }
            {renderContent()}
            <NoExtension open={extensionStatus === 'failure'} />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
