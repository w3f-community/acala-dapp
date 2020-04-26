import React, { FC, memo } from 'react';
import { BareProps } from '@honzon-platform/ui-components/types';

interface Props extends BareProps {
  address: string,
  withFullAddress?: boolean
}

export const FormatAddress: FC<Props> = memo(({
  address,
  className,
  withFullAddress = false
}) => {
  return (
    <span className={className}>
      {withFullAddress ? address : address.replace(/(\w{6})\w*?(\w{12}$)/, '$1......$2')}
    </span>
  );
});

FormatAddress.displayName = 'FormatAddress';
