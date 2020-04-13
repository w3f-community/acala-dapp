import React, { PropsWithChildren } from 'react';

import { makeStyles, createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

import { Sidebar, SideBarProps } from '../components/SideBar';
import { useIsAppReady } from '@honzon-platform/react-hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1
    },
    root: {
      background: theme.palette.background.default,
      display: 'flex',
      height: '100%',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      }
    }
  })
);

interface Props {
  sideBarProps: SideBarProps;
}

export const MainLayout: React.FC<PropsWithChildren<Props>> = ({ children, sideBarProps }) => {
  const classes = useStyles();
  const { appReadyStatus } = useIsAppReady();

  if (!appReadyStatus) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Sidebar {...sideBarProps} />
      {children}
    </div>
  );
};
