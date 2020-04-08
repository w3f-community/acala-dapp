import React, { FC, memo } from 'react';
import { CircularProgress, makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    alignItems: 'center',
    background: theme.palette.common.white,
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw'
  }
}));

export const FullScreenLoading: FC = memo(() => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress disableShrink />
    </div>
  );
});

FullScreenLoading.displayName = 'FullScreenLoading';
