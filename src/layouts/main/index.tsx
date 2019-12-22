import React, { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, useMediaQuery } from '@material-ui/core';
import { Theme, useTheme } from '@material-ui/core/styles';
import acalaTypes from '@acala-network/types/src/interfaces/runtime/definitions';

import { loadingSelector } from '@/store/loading/reducer';
import Loading from '@/components/loading';
import actions from '@/store/actions';
import { getEndPoint, sideBarConfig } from '@/config';
import { connectedSelector } from '@/store/chain/selectors';
import {
    extensionStatusSelector,
    accountListSelector,
    accountSelector,
    accountErrorSelector,
    accountStatusSelector,
} from '@/store/account/selectors';
import Header from './components/header';
import Sidebar from './components/side-bar';
import NoExtension from './components/no-extension';
import NoAccount from './components/no-account';
import SelectAccount from './components/select-account';
import useMobileMatch from '@/hooks/mobile-match';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%',
            width: '100%',
            background: theme.palette.background.default,
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
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
    const accountStatus = useSelector(accountStatusSelector);

    const accountList = useSelector(accountListSelector);
    const account = useSelector(accountSelector);
    const accountError = useSelector(accountErrorSelector);

    const match = useMobileMatch('sm');
    // const connectStatus = useSelector(connectedSelector);

    useEffect(() => {
        // connect to blockchain
        dispatch(actions.chain.connectAsync.request({ endpoint: getEndPoint(), ...acalaTypes }));
        dispatch(actions.account.importAccount.request(''));
    }, [dispatch]);

    const renderContent = () => {
        if (extensionStatus === 'success' && accountStatus === 'success') {
            return <div className={classes.content}>{children}</div>;
        }

        return null;
    };

    // pls. don't change this, beacuse we must ensure that DAPP is aleardy connected the chain-net
    if (connectLoading) {
        return <Loading />;
    }

    return (
        <div className={classes.root}>
            {match ? <Header /> : <Sidebar config={sideBarConfig} />}
            {renderContent()}
            <NoExtension open={accountError === 'no extends found'} />
            <NoAccount open={accountError === 'no accounts found'} />
            <SelectAccount open={accountList.length !== 0 && accountStatus === 'none'} />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
