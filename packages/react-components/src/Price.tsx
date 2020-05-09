import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { DerivedPrice } from '@acala-network/api-derive';

import { usePrice } from '@honzon-platform/react-hooks';
import { BareProps } from '@honzon-platform/ui-components/types';
import { FormatFixed18 } from './format';
import { getValueFromTimestampValue } from './utils';

interface Props extends BareProps {
  token: CurrencyId | string;
}

export const Price: FC<Props> = memo(({
  className,
  token
}) => {
  const price = usePrice(token) as DerivedPrice;

  if (!price || !price.price) {
    return null;
  }

  return (
    <FormatFixed18
      className={className}
      data={convertToFixed18(getValueFromTimestampValue(price.price))}
      prefix='$'
      withPadEndDecimal
    />
  );
});

Price.displayName = 'Price';
