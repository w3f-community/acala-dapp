import React, { FC, memo } from 'react';
import { Fixed18 } from '@acala-network/app-util';

interface Props {
  data: Fixed18;
  format?: 'percentage' | 'number'
}

export const FormatFixed18: FC<Props> = memo(({
  data,
  format = 'number'
}) => {
  if (!data) {
    return null;
  }

  const getRenderText = (): string => {
    if (data.isNaN()) {
      return data.toString();
    }

    if (format === 'number') {
      return data.toString();
    }

    if (format === 'percentage') {
      return data.toNumber() * 100 + '%';
    }

    return '';
  };

  return (
    <span>{getRenderText()}</span>
  );
});

FormatFixed18.displayName = 'FormatFixed18';
