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

    const result = await (api.rpc as any).stakingPool.getAvailableUnbonded(active.address) as Balance;

    if (result && result.isEmpty) {

      return null;
    }

    return result;
  }, [api]);
  const currentRedeem = useInterval<Balance | null>(callback, 1000 * 60, true);

  return currentRedeem;
};

