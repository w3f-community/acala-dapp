import React, { useState } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import AcalaLogo from '@/assets/acala-logo.svg';

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
        container: {
            width: theme.sidebar.width,
            background: theme.palette.primary.main,
        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '70px 0 62px 0',
        },
        icon: {
            marginRight: 16,
        },
        listItem: {
            height: 60,
            padding: '0 0 0 50px',
            color: theme.palette.common.white,
        },
    }),
);

const Sidebar: React.FC = () => {
    const classes = useStyles();
    return (
        <Drawer
            variant="permanent"
            open={true}
            className={classes.root}
            classes={{
                paper: classes.container,
            }}
        >
            <Box className={classes.header}>
                <img src={AcalaLogo} width={40} height={34} className={classes.icon} />
                <Typography variant="h1">Acala Network</Typography>
            </Box>
            <List>
                <ListItem button key="Dashboard" className={classes.listItem}>
                    <ListItemText primary={'Dashboard'} primaryTypographyProps={{ variant: 'h2' }}></ListItemText>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
