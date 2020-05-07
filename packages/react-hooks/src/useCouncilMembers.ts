import { useApi } from "@honzon-platform/react-hooks";
import { Vec } from "@polkadot/types";
import { AccountId } from "@acala-network/types/interfaces/types";

import { useCall } from "./useCall";

export const useCouncilMembers = (council: string) => {
  const { api } = useApi();
  const members = useCall<Vec<AccountId>>(api.query[council].members, []);

  return members;
}