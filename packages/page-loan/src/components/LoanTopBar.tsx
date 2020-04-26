import React, { FC, memo, useContext } from 'react';
import clsx from 'clsx';
import { LoanContext, Token, LoanCollateralRate } from '@honzon-platform/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';

import { ReactComponent as OverviewIcon } from '../assets/overview.svg';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import classes from './LoanTopBar.module.scss';

interface LoanItemProps {
  token: CurrencyId | string;
}

const LoanItem: FC<LoanItemProps> = memo(({
  token
}) => {
  return (
    <div className={classes.item}>
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

interface OverviewProps {

}

const LoanOverview: FC<OverviewProps> = ({}) => {
  return (
    <div className={clsx(classes.item, classes.overview)}>
      <div className={classes.icon}>
        <OverviewIcon />
      </div>
      <div className={classes.content}>
        OVERVIEW
      </div>
    </div>
  );
};

interface LoanAddProps {
  onClick: () => void;
}

const LoanAdd: FC<LoanAddProps> = ({
  onClick
}) => {
  return (
    <div
      className={clsx(classes.item, classes.add)}
      onClick={onClick}
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

interface LoanTopBarProps {
  onClickCreate: () => void;
  onClickOverview: () => void;
}

export const LoanTopBar: FC<LoanTopBarProps> = memo(({
  onClickCreate,
  onClickOverview,
}) => {
  const { loans } = useContext(LoanContext);
  return (
    <div className={classes.root}>
      <LoanOverview />
      {loans.map((item) => <LoanItem token={item.token} />)}
      <LoanAdd onClick={onClickCreate} />
    </div>
  );
});

LoanTopBar.displayName = 'LoanTopBar';