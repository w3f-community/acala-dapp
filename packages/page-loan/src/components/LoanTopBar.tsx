import React, { FC, memo, useContext } from 'react';
import clsx from 'clsx';
import { Token, LoanCollateralRate, LoanProvider } from '@honzon-platform/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';

import { ReactComponent as OverviewIcon } from '../assets/overview.svg';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import classes from './LoanTopBar.module.scss';
import { useLoan, useAllLoans } from '@honzon-platform/react-hooks';
import { LoanContext } from './LoanProvider';

interface LoanItemProps {
  token: CurrencyId | string;
}

const LoanItem: FC<LoanItemProps> = memo(({ token }) => {
  const { setCurrentTab, currentTab } = useContext(LoanContext);
  return (
    <div
      className={
        clsx(
          classes.item,
          {
            [classes.active]: currentTab === token
          }
        )
      }
      onClick={() => setCurrentTab(token)}
    >
      <Token
        className={classes.icon}
        token={token}
        icon
        name={false}
      />
      <div className={classes.content}>
        <Token
          className={classes.token}
          token={token}
          icon={false}
        />
        <LoanCollateralRate
          className={classes.collateralRate}
          token={token}
        />
      </div>
    </div>
  );
});

LoanItem.displayName = 'LoanItem';

const LoanOverview: FC = () => {
  const { showOverview, currentTab } = useContext(LoanContext);

  return (
    <div
      className={clsx(
        classes.item,
        classes.overview,
        {
          [classes.active]: currentTab === 'overview'
        }
      )}
      onClick={showOverview}
    >
      <div className={classes.icon}>
        <OverviewIcon />
      </div>
      <div className={classes.content}>
        OVERVIEW
      </div>
    </div>
  );
};

const LoanAdd: FC = () => {
  const { showCreate } = useContext(LoanContext);

  return (
    <div
      className={clsx(classes.item, classes.add)}
      onClick={showCreate}
    >
      <div className={classes.icon}>
        <AddIcon />
      </div>
      <div className={classes.content}>
        Create
      </div>
    </div>
  );
}

export const LoanTopBar: FC = () => {
  const { loans } = useAllLoans({ filterEmpty: true });

  return (
    <div className={classes.root}>
      <LoanOverview />
      {
        loans && loans.map((item) => (
          <LoanItem
            key={`loan-top-bar-${item.token}`}
            token={item.token}
          />
        ))
      }
      <LoanAdd />
    </div>
  );
};
