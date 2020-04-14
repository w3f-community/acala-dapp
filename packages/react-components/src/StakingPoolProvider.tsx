import React, { createContext, FC, memo, ReactElement } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';

import { QueryStakingPool } from '@honzon-platform/react-query';
import { StakingPoolHelper } from '@acala-network/app-util';

interface ContextData {
  stakingPool: DerivedStakingPool;
  stakingPoolHelper: StakingPoolHelper;
}

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = memo(({ children }) => {
  return (
    <QueryStakingPool
      render={
        (result): ReactElement => (
          <StakingPoolContext.Provider value={result}>
            {children}
          </StakingPoolContext.Provider>
        )
      }
    />
  );
});

StakingPoolProvider.displayName = 'StakingPoolProvider';
