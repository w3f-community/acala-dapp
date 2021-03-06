import { useContext } from 'react';

import { ApiContext, ApiData } from '@acala-dapp/react-environment';

/**
 * @name useApi
 * @description get api context value
 */
export const useApi = (): ApiData => {
  return useContext<ApiData>(ApiContext);
};
