import React, { FC, memo } from 'react';

import { AccountId, CurrencyId } from '@acala-network/types/interfaces/types';
import { Dialog } from '@honzon-platform/ui-components';

interface Props {
  account?: AccountId | string;
  token: CurrencyId | string;
}

const TransferModal: FC<Props> = memo(() => {
  return (
    <Dialog>
    </Dialog>
  );
});
