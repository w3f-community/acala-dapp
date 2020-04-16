import React, { ReactNode, memo } from 'react';
import { Card as SUCard } from 'semantic-ui-react';
import { BareProps } from './types';
import classes from './Card.module.scss';
import clsx from 'clsx';

interface Props extends BareProps {
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  divider?: boolean;
}

export const Card: React.FC<Props> = memo(({ children, className, header }) => {
  return (
    <SUCard className={clsx(classes.root, className)}>
      { header ? <SUCard.Header className={classes.title}>{header}</SUCard.Header> : null }
      <SUCard.Content className='ui-card--content'>
        {children}
      </SUCard.Content>
    </SUCard>
  );
});

Card.displayName = 'Card';
