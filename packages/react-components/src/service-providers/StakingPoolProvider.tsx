import React, { createContext, FC, memo } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';

import { StakingPoolHelper } from '@acala-network/app-util';
import { useStakingPool, FreeItem } from '@honzon-platform/react-hooks';
import { Rate } from '@acala-network/types/interfaces';

interface ContextData {
  stakingPool: DerivedStakingPool;
  stakingPoolHelper: StakingPoolHelper;
  unbondingDuration: number;
  freeList: FreeItem[];
  rewardRate: Rate;
}

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = memo(({ children }) => {

  const result = useStakingPool();

  if (!result) {
    return null;
  }

  return (
    <StakingPoolContext.Provider value={result}>
      {children}
    </StakingPoolContext.Provider>
  );
});

StakingPoolProvider.displayName = 'StakingPoolProvider';
