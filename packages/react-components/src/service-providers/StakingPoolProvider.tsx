import React, { createContext, FC, memo, ReactElement } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';

import { QueryStakingPool } from '@honzon-platform/react-query';
import { StakingPoolHelper } from '@acala-network/app-util';
import { useStakingPool } from '@honzon-platform/react-hooks';

interface ContextData {
  stakingPool: DerivedStakingPool;
  stakingPoolHelper: StakingPoolHelper;
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
