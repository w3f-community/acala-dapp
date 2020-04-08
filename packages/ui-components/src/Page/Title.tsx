import React, { FC, PropsWithChildren, memo } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core';

import { createTypography } from '../utils';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: 52,
    ...createTypography(32, 32, 400, 'Sine', theme.palette.common.black)
  }
}));

export const PageTitle: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>{children}</div>
  );
});

PageTitle.displayName = 'PageTitle';
