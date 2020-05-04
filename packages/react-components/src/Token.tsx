import React, { FC, memo, ReactNode } from 'react';
import clsx from 'clsx';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';

import classes from './Token.module.scss';
import { formatCurrency } from './utils';
import AcaIcon from './assets/coins-icon/ACA.svg';
import AUSDIcon from './assets/coins-icon/aUSD.svg';
import BtcIcon from './assets/coins-icon/BTC.svg';
import DotIcon from './assets/coins-icon/DOT.svg';
import LDotIcon from './assets/coins-icon/LDOT.svg';

interface Props extends BareProps {
  token: CurrencyId | string;
  icon?: boolean;
  name?: boolean;
  upper?: boolean;
  gutter?: boolean;
}

const ICON_CONFIG = {
  aca: AcaIcon,
  ausd: AUSDIcon,
  dot: DotIcon,
  ldot: LDotIcon,
  xbtc: BtcIcon
};

export const Token: FC<Props> = memo(({
  className,
  icon,
  token,
  name = true,
  upper = true,
  gutter = false
}) => {
  if (!token) {
    return null;
  }

  const renderIcon = (): ReactNode => {
    const result = Reflect.get(ICON_CONFIG, token.toString().toLowerCase());

    if (!result) {
      return null;
    }

    return <img src={result} />;
  };

  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          {
            [classes.gutter]: gutter
          }
        )
      }
    >
      {
        icon ? (
          <span className={
            clsx(
              classes.icon,
              {
                [classes.noName]: !name,
              }
            )
          }>
            {renderIcon()}
          </span>
        ) : null
      }
      {name ? formatCurrency(token, upper) : null}
    </div>
  );
});

Token.displayName = 'Token';
