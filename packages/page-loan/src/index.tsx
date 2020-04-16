import React, { FC, memo } from 'react';
import { Page } from '@honzon-platform/ui-components';
import { PricesFeedCard, LoanProvider } from '@honzon-platform/react-components';

const PageLoan: FC = memo(() => {
  return (
    <Page>
      <Page.Title title='Loan' />
      <LoanProvider>
        <Page.Content>
          <PricesFeedCard />
        </Page.Content>
      </LoanProvider>
    </Page>
  );
});

PageLoan.displayName = 'PageLoan';

export default PageLoan;
