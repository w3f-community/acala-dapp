import React, { memo, FC } from 'react';
import { BareProps } from './types';
import classes from './Tag.module.scss';

type Props = BareProps;

export const Tag: FC<Props> = memo(({ children }) => {
  return <span className={classes.root}>{children}</span>;
});

Tag.displayName = 'Tag';
