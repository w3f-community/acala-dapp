import { useState, useEffect } from 'react';
import { get, noop } from 'lodash';
import { useApi } from './useApi';
import { useAccounts } from './useAccounts';

interface Options {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * @name useIsAppReady
 * @description check app status, return true when chain connected and has active account, in ohter case return false.
 */
export const useIsAppReady = (options?: Options): { appReadyStatus: boolean } => {
  const [appReadyStatus, setAppReadyStatus] = useState<boolean>(false);
  const { connected } = useApi();
  const { active: activeAccount } = useAccounts();

  useEffect(() => {
    const status = !!activeAccount && !!activeAccount.address && connected;

    // handle onSuccess or onError callback
    (status ? get(options, 'onSuccess', noop) : get(options, 'onError', noop))();
    setAppReadyStatus(status);
  }, [activeAccount, connected, options]);

  return { appReadyStatus };
};
