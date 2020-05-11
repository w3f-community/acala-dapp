import { useState, useEffect, useCallback, useMemo } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Amount, Rate, BlockNumber, Balance } from '@acala-network/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useAccounts } from './useAccounts';
import { start } from 'repl';

export interface FreeItem {
  era: number;
  free: Fixed18;
}

export interface RedeemItem {
  era: number;
  balance: Fixed18;
}

export interface useStakingPoolReturnType {
  stakingPool: DerivedStakingPool | undefined;
  stakingPoolHelper: StakingPoolHelper;
  unbondingDuration: number;
  eraDuration: number;
  freeList: FreeItem[];
  rewardRate: Rate;
  redeemList: RedeemItem[];
}

export const useStakingPool = (): useStakingPoolReturnType => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper>(null as any as StakingPoolHelper);
  // FIXME: need fix api-derive type
  const stakingPool = useCall<DerivedStakingPool>((api.derive as any).homa.stakingPool, []);
  const rewardRate = useCall<Rate>(api.query.polkadotBridge.mockRewardRate, []) as Rate;

  const [freeList, setFreeList] = useState<FreeItem[]>([]);
  const [redeemList, setRedeemList] = useState<RedeemItem[]>([]);

  const unbondingDuration = useMemo<number>(() => {
    if (!api || !stakingPool) {
      return 0;
    }

    const eraLength = api.consts.polkadotBridge.eraLength as BlockNumber;
    const expectedBlockTime = api.consts.babe.expectedBlockTime;

    return expectedBlockTime.toNumber() * eraLength.toNumber() * stakingPool.bondingDuration.toNumber();
  }, [api, stakingPool])

  const eraDuration = useMemo<number>(() => {
    if (!api) {
      return 0;
    }

    const eraLength = api.consts.polkadotBridge.eraLength as BlockNumber;
    const expectedBlockTime = api.consts.babe.expectedBlockTime;

    return expectedBlockTime.toNumber() * eraLength.toNumber();

  }, [api]);

  const fetchFreeList = useCallback(async (start: number, duration: number) => {
    const list = [];

    for (let i = start; i < start + duration; i++) {
      const result = await api.query.stakingPool.unbonding<Amount[]>(i);
      const free = Fixed18.fromParts(result[0].toString()).sub(Fixed18.fromParts(result[1].toString()));

      list.push({
        era: i,
        free: free
      });
    }

    return list.filter((item) => !item.free.isZero());
  }, [api]);

  const fetchRedeemList = useCallback(async () => {
    if (!stakingPool || !active) {
      return [];
    }

    const duration = stakingPool.bondingDuration.toNumber();
    const start = stakingPool.currentEra.toNumber();
    const list = [];

    for (let i = start; i < start + duration + 2; i++) {
      const result = await api.query.stakingPool.claimedUnbond<Balance>(active.address, i);

      if (!result.isEmpty) {
        list.push({
          era: i,
          balance: convertToFixed18(result)
        });
      }
    }

    return list;
  }, [stakingPool, active]);

  useEffect(() => {
    (async () => {
      const list = await fetchRedeemList();
      setRedeemList(list);
    })();
  }, [fetchRedeemList, setRedeemList]);

  useEffect(() => {
    if (stakingPool) {
      (async () => {
        const list = await fetchFreeList(
          stakingPool.currentEra.toNumber() + 1,
          stakingPool.bondingDuration.toNumber()
        );

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

  return {
    stakingPool,
    stakingPoolHelper,
    freeList,
    rewardRate,
    unbondingDuration,
    eraDuration,
    redeemList
  };
};
