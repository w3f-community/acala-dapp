import React, { FC, memo } from 'react';
import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@honzon-platform/ui-components/types';
import { thousandth } from '../utils';

interface Props extends BareProps {
  data: Fixed18;
  format?: 'percentage' | 'number' | 'thousandth';
  prefix?: string;
}

export const FormatFixed18: FC<Props> = memo(({
  className,
  data,
  prefix,
  format = 'thousandth',
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

    if (format === 'thousandth') {
      return thousandth(data.toNumber());
    }

    if (format === 'percentage') {
      return data.mul(Fixed18.fromNatural(100)).toNumber(2, 3) + '%';
    }

    return '';
  };

  return (
    <span className={className}>
      {prefix ? prefix : null}
      {getRenderText()}
    </span>
  );
});

FormatFixed18.displayName = 'FormatFixed18';
