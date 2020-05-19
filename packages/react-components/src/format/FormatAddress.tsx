import React, { FC, memo, ReactNode } from 'react';

import { BareProps } from '@honzon-platform/ui-components/types';
import { Copy } from '@honzon-platform/ui-components';
import Identicon from '@polkadot/react-identicon';

import classes from './format.module.scss';

interface Props extends BareProps {
  address: string;
  withFullAddress?: boolean;
  withCopy?: boolean;
  withIcon?: boolean;
  iconWidth?: number;
}

export const FormatAddress: FC<Props> = memo(({
  address,
  className,
  iconWidth = 22,
  withCopy = false,
  withFullAddress = false,
  withIcon = false
}) => {
  return (
    <Copy
      className={className}
      render={(): ReactNode => {
        return (
          <>
            {withIcon ? (
              <Identicon
                className={classes.icon}
                size={iconWidth}
                theme='substrate'
                value={address}
              />
            ) : null }
            {withFullAddress ? address : address.replace(/(\w{6})\w*?(\w{6}$)/, '$1......$2')}
          </>
        );
      }}
      text={address}
      withCopy={withCopy}
    />
  );
});

FormatAddress.displayName = 'FormatAddress';
