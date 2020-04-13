import { FC, useState, useEffect } from 'react';
import { DerivedStakingPool } from '@acala-network/api-derive';

import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';

import { BaseQueryElementProps } from './type';
import { StakingPoolHelper } from '@acala-network/app-util';

type Props =  BaseQueryElementProps<{ stakingPool: DerivedStakingPool, stakingPoolHelper: StakingPoolHelper }>;

export const QueryStakingPool : FC<Props> = ({ render }) => {
  const { api } = useApi();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper>(null as any as StakingPoolHelper);
  // FIXME: need fix api-derive type
  const stakingPool = useCall<DerivedStakingPool>((api.derive as any).homa.stakingPool, []);

  useEffect(() => {
    if (stakingPool) {
      setStakingPoolHelper(
        new StakingPoolHelper({
          totalBonded: stakingPool.totalBonded,
          communalFree: stakingPool.freeUnbonded,
          unbondingToFree: stakingPool.unbondingToFree,
          nextEraClaimedUnbonded: stakingPool.nextEraUnbond[1],
          liquidTokenIssuance: stakingPool.liquidTokenIssuance,
          defaultExchangeRate: stakingPool.defaultExchangeRate,
          maxClaimFee: stakingPool.maxClaimFee,
          bondingDuration: stakingPool.bondingDuration,
          currentEra: stakingPool.currentEra
        })
      )
    }
  }, [stakingPool]);

  if (stakingPool && stakingPoolHelper) {
    return render({ stakingPool, stakingPoolHelper });
  }

  return null;
};
