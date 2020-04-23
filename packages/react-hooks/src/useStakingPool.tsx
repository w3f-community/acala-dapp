import { useState, useEffect } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useCall } from './useCall';

export const useStakingPool = () => {
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
    return { stakingPool, stakingPoolHelper };
  }
};
