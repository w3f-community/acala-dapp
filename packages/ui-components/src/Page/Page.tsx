import React, { FC, PropsWithChildren, memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
    margin: theme.spacing(2),
    width: '100%'
  }
}));

export const Page: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
});

Page.displayName = 'Page';
