import { memo, FC } from 'react';
import { useApi, useCall } from '@honzon-platform/react-hooks';

import { BaseQueryElementProps } from './type';
import { Balance } from '@polkadot/types/interfaces';

type Props = {
  token: string;
} & BaseQueryElementProps<number>;

export const QueryTokenIssue: FC<Props> = memo(({ render, token }) => {
  const api = useApi();
  const issue = useCall<Balance>(api.query.tokens.totalIssuance, [token]);

  if (issue) {
    return render(issue.toNumber());
  }

  return null;
});
