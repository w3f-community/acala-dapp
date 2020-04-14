import { FC, useState, useEffect, memo } from 'react';
import { DerivedStakingPool } from '@acala-network/api-derive';

import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';

import { BaseQueryElementProps } from './type';
import { StakingPoolHelper } from '@acala-network/app-util';

type Props = BaseQueryElementProps<{
  stakingPool: DerivedStakingPool;
  stakingPoolHelper: StakingPoolHelper;
}>;

export const QueryStakingPool: FC<Props> = memo(({ render }) => {
  const { api } = useApi();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper>(null as any as StakingPoolHelper);
  // FIXME: need fix api-derive type
  const stakingPool = useCall<DerivedStakingPool>((api.derive as any).homa.stakingPool, []);

  useEffect(() => {
    if (stakingPool) {
      setStakingPoolHelper(
        new StakingPoolHelper({
          bondingDuration: stakingPool.bondingDuration,
          communalFree: stakingPool.freeUnbonded,
          currentEra: stakingPool.currentEra,
          defaultExchangeRate: stakingPool.defaultExchangeRate,
          liquidTokenIssuance: stakingPool.liquidTokenIssuance,
          maxClaimFee: stakingPool.maxClaimFee,
          nextEraClaimedUnbonded: stakingPool.nextEraUnbond[1],
          totalBonded: stakingPool.totalBonded,
          unbondingToFree: stakingPool.unbondingToFree
        })
      );
    }
  }, [stakingPool]);

  if (stakingPool && stakingPoolHelper) {
    return render({ stakingPool, stakingPoolHelper });
  }

  return null;
});

QueryStakingPool.displayName = 'QueryStakingPool';
