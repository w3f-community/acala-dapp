import { Balance } from "@acala-network/types/interfaces/runtime";

import { useInterval } from "./useInterval";
import { useAccounts } from "./useAccounts";
import { useApi } from "./useApi";
import { useCallback } from "react";

export function useCurrentRedeem () {
  const { api } = useApi();
  const { active } = useAccounts();
  const callback = useCallback(async () => {
    if (!active || !api) {
      return null;
    }

    return await (api.rpc as any).stakingPool.getAvailableUnbonded(active.address);
  }, [api]);
  const currentRedeem = useInterval<Balance>(callback, 1000 * 60, true);

  return currentRedeem;
};

