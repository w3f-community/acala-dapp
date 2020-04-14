import React, { FC, memo } from 'react';

export const FormatAddress: FC<{ address: string }> = memo(({ address }) => {
  return (
    <p>{address.replace(/(\w{6})\w*?(\w{12}$)/, '$1......$2')}</p>
  );
});

FormatAddress.displayName = 'FormatAddress';
