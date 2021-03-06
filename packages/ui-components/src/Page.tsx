import React, { FC, memo } from 'react';
import { BareProps } from './types';
import classes from './Page.module.scss';

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

Title.displayName = 'PageTitle';

const _Page: FC<BareProps> = memo(({ children }) => {
  return (
    <div className={classes.page}>
      {children}
    </div>
  );
});

_Page.displayName = 'Page';

const Content: FC<BareProps> = memo(({ children }) => {
  return (
    <div className={classes.pageContent}>
      {children}
    </div>
  );
});

Content.displayName = 'PageContent';

interface PageType extends FC<BareProps> {
  Title: typeof Title;
  Content: typeof Content;
}

const Page = _Page as unknown as PageType;

Page.Title = Title;
Page.Content = Content;

export { Page };
