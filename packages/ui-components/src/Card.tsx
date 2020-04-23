import React, { ReactNode, memo } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Card.module.scss';

interface Props extends BareProps {
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  divider?: boolean;
  gutter?: boolean;
}

export const Card: React.FC<Props> = memo(({
  children,
  className,
  contentClassName,
  header,
  headerClassName,
  gutter = true
}) => {
  return (
    <section className={clsx(classes.root, className)}>
      { header ? <div className={clsx(headerClassName, classes.title)}>{header}</div> : null }
      <div className={
        clsx(
          contentClassName,
          classes.content,
          {
            [classes.gutter]: gutter,
            [classes.noTitleContent]: !header && gutter
          }
        )
      }>
        {children}
      </div>
    </section>
  );
});

Card.displayName = 'Card';
