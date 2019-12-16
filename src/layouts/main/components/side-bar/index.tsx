import React from 'react';
import { Typography, Drawer, List, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import AcalaLogo from '@/assets/acala-logo.svg';
import { SideBarConfig } from '@/types/sidebar';

import DashboardIcon from '@/assets/dashboard.svg';
import WalletIcon from '@/assets/wallet.svg';
import ConnectStatus from './connect-status';
import Item from './item';
import { useSelector } from 'react-redux';
import { accountSelector } from '@/store/user/selectors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: theme.sidebar.width,
            flexShrink: 0,
            '& .MuiTypography-h1': {
                color: theme.palette.common.white,
            },
            '& .MuiTypography-h2': {
                color: theme.palette.common.white,
            },
        },
        paper: {
            width: theme.sidebar.width,
            background: theme.palette.primary.main,
        },
        header: { padding: '70px 0 62px 0' },
        icon: { marginRight: 16 },
        connectBar: {
            marginBottom: 90,
        },
        products: {
            margin: '50px 0 112px 0',
        },
    }),
);

interface Props {
    config: SideBarConfig;
}

const Sidebar: React.FC<Props> = ({ config }) => {
    const classes = useStyles();
    const account = useSelector(accountSelector);

    return (
        <Drawer variant="permanent" open={true} classes={{ root: classes.root, paper: classes.paper }}>
            <Grid className={classes.header} container justify="center" alignItems="center">
                <img src={AcalaLogo} width={40} height={34} className={classes.icon} />
                <Typography variant="h1">Acala Network</Typography>
            </Grid>
            <List>
                <Item data={{ name: account.address.slice(0, 8) + '...', path: '/user', icon: WalletIcon }} />
                <Item data={{ name: 'Dashboard', path: '/', icon: DashboardIcon }} />
            </List>
            <div style={{ flex: 1 }}>
                <List className={classes.products}>
                    {config.products.map(data => (
                        <Item data={data} key={`products-${data.name}`} />
                    ))}
                </List>
                <List>
                    {config.socialMedia.map(data => (
                        <Item data={data} key={`products-${data.name}`} />
                    ))}
                </List>
            </div>
            <Grid container justify="center" className={classes.connectBar}>
                <ConnectStatus />
            </Grid>
        </Drawer>
    );
};

export default Sidebar;
