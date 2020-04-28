import { DerivedPrice } from "@acala-network/api-derive";
import { set } from 'lodash';
import { useApi } from "./useApi";
import { useCall } from "./useCall";
import { CurrencyId } from "@acala-network/types/interfaces";
import { tokenEq, getValueFromTimestampValue } from "@honzon-platform/react-components";
import { useStakingPool } from "./useStakingPool";
import { convertToFixed18 } from "@acala-network/app-util";
import { TimestampedValue } from "@open-web3/orml-types/interfaces";
import { useEffect, useState } from "react";

export const usePrice = (token?: CurrencyId | string) => {
  const { api } = useApi();
  const _price = useCall<DerivedPrice[]>((api.derive as any).price.allPrices, []) || [];
  const [price, setPrice] = useState<DerivedPrice[]>([]);
  const stakingPool = useStakingPool();

  useEffect(() => {
    // L-DOT price
    if (_price && stakingPool) {
      const stakingCurrencyPrice = _price.find((item) => tokenEq(item.token, stakingPool.stakingPool.stakingCurrency));
      const exchangeRate = stakingPool.stakingPoolHelper.liquidExchangeRate;
      if (stakingCurrencyPrice && exchangeRate) {
        const liquidPrice = convertToFixed18(getValueFromTimestampValue(stakingCurrencyPrice.price)).mul(exchangeRate);
        const _TimestampedValue = api.registry.get('TimestampedValue')!;
        const index = _price.findIndex((item) => tokenEq(item.token, stakingPool.stakingPool.liquidCurrency));
        if (!index) {
          _price.push({
            token: stakingPool.stakingPool.liquidCurrency.toString(),
            price: (new _TimestampedValue(api.registry, { value: liquidPrice.innerToString() }) as TimestampedValue)
          });
        } else {
          _price[index] = {
            token: stakingPool.stakingPool.liquidCurrency.toString(),
            price: (new _TimestampedValue(api.registry, { value: liquidPrice.innerToString() }) as TimestampedValue)
          };
        }
      }
    }
    setPrice(_price || []);
  }, [_price, stakingPool]);


  if (token && price) {
    return price.find((item: DerivedPrice) => item.token === token.toString());
  }

  return price;
}
