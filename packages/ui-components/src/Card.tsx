import React, { ReactNode, memo } from 'react';
import { Card as SUCard } from 'semantic-ui-react';
import { BareProps } from './types';
import classes from './Card.module.scss';

type Size = 'normal' | 'large' | 'small';

interface Props extends BareProps {
  size: Size;
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  divider?: boolean;
}

export const Card: React.FC<Props> = memo(({ children, header }) => {
  return (
    <SUCard className='ui-card'>
      { header ? <SUCard.Header className={classes.title}>{header}</SUCard.Header> : null }
      <SUCard.Content className='ui-card--content'>
        {children}
      </SUCard.Content>
    </SUCard>
  );
});

Card.displayName = 'Card';
