import React, { PropsWithChildren } from 'react';

import { useIsAppReady } from '@honzon-platform/react-hooks';
import { Loading } from '@honzon-platform/ui-components';

import { Sidebar, SideBarProps } from '../components/SideBar';
import classes from './Main.module.scss';

interface Props {
  sideBarProps: SideBarProps;
}

export const MainLayout: React.FC<PropsWithChildren<Props>> = ({ children, sideBarProps }) => {
  const { appReadyStatus } = useIsAppReady();

  return (
    <div className={classes.root}>
      <Sidebar {...sideBarProps} />
      <div className={classes.content}>
        {appReadyStatus ? children : <Loading />}
      </div>
    </div>
  );
};
