import React, { createContext, FC, memo, useState, useEffect } from 'react';
import { useStakingPool, useStakingPoolReturnType, useInitialize } from '@honzon-platform/react-hooks';
import { PageLoading } from '@honzon-platform/ui-components';

export type ACTION_TYPE = 'staking' | 'redeem';

export  interface ContextData extends useStakingPoolReturnType {
  action: ACTION_TYPE;
  setAction: (type: ACTION_TYPE) => void;
}

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = memo(({ children }) => {
  const [action, setAction] = useState<ACTION_TYPE>('staking');
  const result = useStakingPool();
  const { isInitialized, setEnd } = useInitialize();

  useEffect(() => {
    if (result?.stakingPool) {
      setEnd();
    }
  }, [result]);

  return (
    <StakingPoolContext.Provider value={{ ...result, action, setAction }}>
      {isInitialized ? children : <PageLoading />}
    </StakingPoolContext.Provider>
  );
});

StakingPoolProvider.displayName = 'StakingPoolProvider';
