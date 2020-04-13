import React, { createContext, PropsWithChildren, FC } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';

import { QueryStakingPool } from '@honzon-platform/react-query';
import { StakingPoolHelper } from '@acala-network/app-util';

interface ContextData {
  stakingPool: DerivedStakingPool;
  stakingPoolHelper: StakingPoolHelper;
}

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = ({ children }) => {
  return (
    <QueryStakingPool
      render={
        (result) => (
          <StakingPoolContext.Provider value={result}>
            {children}
          </StakingPoolContext.Provider>
        )
      }
    />
  );
}
