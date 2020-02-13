import React from 'react';
import { Drawer, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { SideBarConfig } from '@/types/sidebar';

import ConnectStatus from './connect-status';
import { useSelector } from 'react-redux';
import { accountSelector } from '@/store/account/selectors';
import { AcalaLogo } from '@/components/acala-logo';
import { Products } from './products';
import { SocialMedias } from './socal-medias';

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
        bottom: {
            marginBottom: 40,
        },
        social: {
            marginBottom: 40,
        },
    }),
);

interface Props {
    config: SideBarConfig;
}

const Sidebar: React.FC<Props> = ({ config }) => {
    const classes = useStyles();

    return (
        <Drawer variant="permanent" open={true} classes={{ root: classes.root, paper: classes.paper }}>
            <Grid className={classes.header} container justify="center" alignItems="center">
                <AcalaLogo />
            </Grid>
            {/*
                    <List>
                        <Item data={{ name: formatAddress(account), path: '/user', icon: WalletIcon }} />
                        <Item data={{ name: 'Dashboard', path: '/', icon: DashboardIcon }} />
                    </List>
                */}
            <div style={{ flex: 1 }}>
                <Products data={config.products} />
            </div>
            <Grid container justify="center" className={classes.bottom}>
                <SocialMedias data={config.socialMedia} />
                <ConnectStatus />
            </Grid>
        </Drawer>
    );
};

export default Sidebar;
