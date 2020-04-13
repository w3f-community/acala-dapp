import React, { FC, memo } from 'react';
import { BareProps } from './types';
import classes from './Page.module.css';

interface TitleProps extends BareProps {
  title: string;
}

const Title: FC<TitleProps> = memo(({ title }) => {
  return (
    <div className={classes.pageTitle}>
      <p className='page-title--content'>{title}</p>
    </div>
  );
});

const _Page: FC<BareProps> = memo(({ children }) => {
  return (
    <div className={classes.page}>
      {children}
    </div>
  );
});

const Content: FC<BareProps> = memo(({ children }) => {
  return (
    <section className={classes.pageContent}>
      {children}
    </section>
  );
});

interface PageType {
  Title: typeof Title;
  Content: typeof Content;
}

const Page = _Page as unknown  as PageType;


Page.Title = Title;
Page.Content = Content;

export { Page };