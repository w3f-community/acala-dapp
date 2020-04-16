import { FC } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';

import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';

import { BaseQueryElementProps } from './type';

type Props = BaseQueryElementProps<DerivedPrice[]>;

export const QueryAllPrices: FC<Props> = ({ render }) => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const price = useCall<DerivedPrice[]>((api.derive as any).price.allPrices, []);

  if (price) {
    return render(price);
  }

  return null;
};
