import React, { FC, memo, ReactNode } from 'react';
import clsx from 'clsx';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';

import classes from './Token.module.scss';
import { formatCurrency } from './utils';
import { ReactComponent as AUSDIcon } from './assets/coins-icon/aUSD.svg';
import { ReactComponent as BtcIcon } from './assets/coins-icon/btc.svg';
import { ReactComponent as DotIcon } from './assets/coins-icon/dot.svg';
import { ReactComponent as EthIcon } from './assets/coins-icon/eth.svg';

interface Props extends BareProps {
  token: CurrencyId | string;
  icon?: boolean;
  name?: boolean;
  upper?: boolean;
}

const ICON_CONFIG = {
  ausd: AUSDIcon,
  dot: DotIcon,
  eth: EthIcon,
  ldot: DotIcon,
  xbtc: BtcIcon
};

export const Token: FC<Props> = memo(({
  className,
  icon,
  token,
  name = true,
  upper = true
}) => {
  if (!token) {
    return null;
  }

  const renderIcon = (): ReactNode => {
    const result = Reflect.get(ICON_CONFIG, token.toString().toLowerCase());

    if (!result) {
      return null;
    }

    return React.createElement(result);
  };

  return (
    <div className={clsx(classes.root, className)}>
      {
        icon ? (
          <span className={classes.icon}>
            {renderIcon()}
          </span>
        ) : null
      }
      {name ? formatCurrency(token, upper) : null}
    </div>
  );
});

Token.displayName = 'Token';
