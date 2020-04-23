import { DerivedPrice } from "@acala-network/api-derive";

import { useApi } from "./useApi";
import { useCall } from "./useCall";
import { CurrencyId } from "@acala-network/types/interfaces";

export const usePrice = (token?: CurrencyId | string) => {
  const { api } = useApi();
  const price = useCall<DerivedPrice[]>((api.derive as any).price.allPrices, []);

  if (token && price) {
    return price.find((item: DerivedPrice) => item.token === token.toString());
  }

  return price;
}
