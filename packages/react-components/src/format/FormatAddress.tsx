import React, { FC, memo } from 'react';
import { BareProps } from '@honzon-platform/ui-components/types';

interface Props extends BareProps {
  address: string
}

export const FormatAddress: FC<Props> = memo(({
  address,
  className
}) => {
  return (
    <span className={className}>
      {address.replace(/(\w{6})\w*?(\w{12}$)/, '$1......$2')}
    </span>
  );
});

FormatAddress.displayName = 'FormatAddress';
