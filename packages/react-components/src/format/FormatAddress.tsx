import React, { FC, memo } from 'react';

export const FormatAddress: FC<{ address: string }> = memo(({ address }) => {
  return (
    <span>{address.replace(/(\w{6})\w*?(\w{12}$)/, '$1......$2')}</span>
  );
});

FormatAddress.displayName = 'FormatAddress';
