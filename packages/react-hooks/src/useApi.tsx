import { useContext } from 'react';
import { ApiPromise } from '@polkadot/api';
import { EnvironmentContext, EnvironmentData } from '@honzon-platform/react-components';

/**
 * @name useApi
 * @description get api instance in environment context
 */
export const useApi = (): ApiPromise => {
  const data = useContext<EnvironmentData>(EnvironmentContext);

  return data.api;
};
