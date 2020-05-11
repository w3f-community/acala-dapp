import React, { createContext, FC, memo } from 'react';

import { DerivedStakingPool } from '@acala-network/api-derive';

import { StakingPoolHelper } from '@acala-network/app-util';
import { useStakingPool, FreeItem, useStakingPoolReturnType } from '@honzon-platform/react-hooks';
import { Rate } from '@acala-network/types/interfaces';

export const StakingPoolContext = createContext<useStakingPoolReturnType>({} as useStakingPoolReturnType);

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
