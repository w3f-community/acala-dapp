import { useState, useEffect } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { Amount } from '@acala-network/types/interfaces';

export interface FreeItem {
  era: number;
  free: number;
}

export const useStakingPool = () => {
  const { api } = useApi();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper>(null as any as StakingPoolHelper);
  const [freeList, setFreeList] = useState<FreeItem[]>([]);
  // FIXME: need fix api-derive type
  const stakingPool = useCall<DerivedStakingPool>((api.derive as any).homa.stakingPool, []);
  const eraLength = api.consts.polkadotBridge.eraLength;
  const expectedBlockTime = api.consts.babe.expectedBlockTime;

  const fetchFeeList = async (start: number, duration: number) => {
    const list = [];
    for (let i = start; i < start + duration; i++) {
      const result = await api.query.stakingPool.unbonding<Amount[]>(i);
      const free = Fixed18.fromParts(result[0].toString()).sub(Fixed18.fromParts(result[1].toString()));
      list.push({
        era: i,
        free: free.toNumber()
      });
    }
    return list.filter((item) => item.free);
  };

  useEffect(() => {
    if (stakingPool) {
      (async () => {
        const list = await fetchFeeList(stakingPool.currentEra.toNumber(), stakingPool.bondingDuration.toNumber());
        setFreeList(list);
      })();
    }
  }, [stakingPool]);

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
    const unbondingDuration = expectedBlockTime.toNumber() * Number(eraLength.toString()) * stakingPool.bondingDuration.toNumber();
    return {
      stakingPool,
      stakingPoolHelper,
      unbondingDuration,
      freeList
    };
  }
};
