import React from 'react';

import { ReactComponent as ComingSoonImg } from './assets/coming-soon.svg';
import classes from './ComingSoon.module.scss';

export const ComingSoon: FC = () => {
  return (
    <div className={classes.root}>
      <p className={classes.title}>Coming Soon…</p>
      <ComingSoonImg />
    </div>
  );
}
