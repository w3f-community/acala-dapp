import { useContext } from 'react';
import { EnvironmentContext, EnvironmentData } from '@honzon-platform/react-components';

/**
 * @name useEnvironment
 * @description get environment context value
 */
export const useEnvironment = (): EnvironmentData => {
  return useContext<EnvironmentData>(EnvironmentContext);
};
