import React from 'react';
import { createStyles, makeStyles, Theme, Drawer, Grid } from '@material-ui/core';

import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';
// import { AcalaLogo } from '@honzon-platform/apps/components/acala-logo';
import { Products } from './Products';
import { SocialMedias } from './SocalMedias';
import { UserCenter } from './UserCenter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottom: {
      marginBottom: 40
    },
    header: { padding: '70px 0 28px 0' },
    paper: {
      background: theme.palette.primary.main,
      width: 270
    },
    root: {
      flexShrink: 0,
      width: 270
    },
    social: {
      marginBottom: 40
    }
  })
);

export interface SideBarProps {
  config: SideBarConfig;
}

export const Sidebar: React.FC<SideBarProps> = ({ config }) => {
  const classes = useStyles();

  return (
    <Drawer
      classes={{ paper: classes.paper, root: classes.root }}
      open={true}
      variant='permanent'
    >
      <Grid
        alignItems='center'
        className={classes.header}
        container
        justify='center'
      ></Grid>
      {/*
                    <List>
                        <Item data={{ name: formatAddress(account), path: '/user', icon: WalletIcon }} />
                        <Item data={{ name: 'Dashboard', path: '/', icon: DashboardIcon }} />
                    </List>
                */}
      <UserCenter />
      <Products data={config.products} />
      <SocialMedias data={config.socialMedia} />
    </Drawer>
  );
};
