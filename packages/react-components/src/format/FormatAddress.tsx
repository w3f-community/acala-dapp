import React, { FC, memo } from 'react';

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
  withCopy = false,
  withFullAddress = false,
  withIcon = false,
  iconWidth = 22
}) => {
  return (
    <Copy
      className={className}
      text={address} 
      render={() => {
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
            {withFullAddress ? address : address.replace(/(\w{6})\w*?(\w{12}$)/, '$1......$2')}
          </>
        );
      }}
      withCopy={withCopy}
    />
  );
});

FormatAddress.displayName = 'FormatAddress';
