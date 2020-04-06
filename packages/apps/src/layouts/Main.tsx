import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

import { Sidebar } from '../components/Sidebar';

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
    },
    toolbar: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar
    }
  })
);

export const MainLayout: React.FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      {children}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
