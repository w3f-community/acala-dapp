import React, { FC, memo } from 'react';
import { Fixed18 } from '@acala-network/app-util';

interface Props {
  data: Fixed18;
}

export const FormatFixed18: FC<Props> = memo(({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <p>
      { data.toString() }
    </p>
  );
});

FormatFixed18.displayName = 'FormatFixed18';
