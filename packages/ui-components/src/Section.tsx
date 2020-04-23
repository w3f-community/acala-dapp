import React, { FC, memo } from 'react';

import { BareProps } from './types';
import classes from './Section.module.scss';

interface Props extends BareProps {
  title: string;
}

export const Section: FC<Props> = memo(({
  children,
  title,
}) => {
  return (
    <section className={classes.root}>
      <div className={classes.title}>{title}</div>
      <div>{children}</div>
    </section>
  );
});

Section.displayName = 'Section';