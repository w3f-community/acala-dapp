import React, { FC, memo, useCallback, useState } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { TxButton, formatBalance } from '@honzon-platform/react-components';
import { useAccounts, useCall } from '@honzon-platform/react-hooks';
import { BalanceWrapper } from '@acala-network/types/interfaces';

export const WithdrawUnbonded: FC = memo(() => {
  const { active } = useAccounts();
  const [_refresh, setRefresh] = useState<number>(0);
  const result = useCall<BalanceWrapper>('rpc.stakingPool.getAvailableUnbonded', [active ? active.address : '']);

  const handleSuccess = useCallback(() => {
    setRefresh(_refresh + 1);
  }, [_refresh]);

  if (!result) {
    return null;
  }

  return (
    <Card>
      <p>
        {`You have ${formatBalance(result.amount).toNumber()} can withdraw`}
      </p>
      {
        !result.amount.isEmpty && (
          <TxButton
            method='withdrawRedemption'
            onSuccess={handleSuccess}
            params={[]}
            section='homa'
          >
            Withdraw
          </TxButton>
        )
      }
    </Card>
  );
});

WithdrawUnbonded.displayName = 'WithdrawUnbonded';
