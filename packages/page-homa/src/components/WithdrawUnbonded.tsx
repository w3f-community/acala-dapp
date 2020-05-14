import React, { FC, memo } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { TxButton, formatBalance } from '@honzon-platform/react-components';
import { useApi, useAccounts, useCall } from '@honzon-platform/react-hooks';
import { BalanceWrapper } from '@acala-network/types/interfaces';

export const WithdrawUnbonded: FC = memo(() => {
  const { api } = useApi();
  const { active } = useAccounts();
  const result = useCall<BalanceWrapper>('rpc.stakingPool.getAvailableUnbonded', [active ? active.address : '']);

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
