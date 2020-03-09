import React, { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

import { loadingSelector } from '@honzon-platform/apps/store/loading/reducer';
import Loading from '@honzon-platform/apps/components/loading';
import actions from '@honzon-platform/apps/store/actions';
import { sideBarConfig } from '@honzon-platform/apps/config';
import { accountStoreSelector } from '@honzon-platform/apps/store/account/selectors';
import Header from './components/header';
import Sidebar from './components/side-bar';
import NoExtension from './components/no-extension';
import NoAccount from './components/no-account';
import { SelectAccount } from '@honzon-platform/apps/components/select-account';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import TxStatus from '@honzon-platform/apps/components/tx-status';
import { useEnvironment } from '@honzon-platform/apps/hooks/environment';

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
    const [accountStatus, accountList, extensionStatus, accountError] = useSelector(
        accountStoreSelector(['accountStatus', 'accountList', 'extensionStatus', 'error']),
    );
    const { endpoint } = useEnvironment();

    const match = useMobileMatch('sm');
    // const connectStatus = useSelector(connectedSelector);

    useEffect(() => {
        // connect to blockchain
        dispatch(actions.chain.connectAsync.request({ endpoint }));
        dispatch(actions.account.importAccount.request(''));
    }, [dispatch]);

    const renderContent = () => {
        if (extensionStatus === 'success' && accountStatus === 'success') {
            return <div className={classes.content}>{children}</div>;
        }

        return null;
    };

    // don't change this, beacuse we must ensure that DAPP connected the blockchain successful
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
            <TxStatus />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
