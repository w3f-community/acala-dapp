import { useState, useEffect, useCallback } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { Amount, Rate } from '@acala-network/types/interfaces';

export interface FreeItem {
  era: number;
  free: number;
}

interface useStakingPoolReturnType {
  stakingPool: DerivedStakingPool | undefined;
  stakingPoolHelper: StakingPoolHelper;
  unbondingDuration: number;
  freeList: FreeItem[];
  rewardRate: Rate;
}

export const useStakingPool = (): useStakingPoolReturnType => {
  const { api } = useApi();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper>(null as any as StakingPoolHelper);
  const [freeList, setFreeList] = useState<FreeItem[]>([]);
  // FIXME: need fix api-derive type
  const stakingPool = useCall<DerivedStakingPool>((api.derive as any).homa.stakingPool, []);
  const eraLength = api.consts.polkadotBridge.eraLength;
  const expectedBlockTime = api.consts.babe.expectedBlockTime;
  const rewardRate = useCall<Rate>(api.query.polkadotBridge.mockRewardRate, []) as Rate;
  const [unbondingDuration, setUnbondingDuration] = useState<number>(0);

  const fetchFeeList = useCallback(async (start: number, duration: number) => {
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
  }, [api.query.stakingPool]);

  useEffect(() => {
    if (stakingPool) {
      (async () => {
        const list = await fetchFeeList(stakingPool.currentEra.toNumber(), stakingPool.bondingDuration.toNumber());

        setFreeList(list);
      })();
    }
  }, [fetchFeeList, stakingPool]);

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
      setUnbondingDuration(expectedBlockTime.toNumber() * Number(eraLength.toString()) * stakingPool.bondingDuration.toNumber());
    }
  }, [eraLength, expectedBlockTime, stakingPool]);

  return {
    stakingPool,
    stakingPoolHelper,
    unbondingDuration,
    freeList,
    rewardRate
  };
};
