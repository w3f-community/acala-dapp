import { useEffect, useState, useRef } from "react";

import { DerivedPrice } from "@acala-network/api-derive";
import { CurrencyId } from "@acala-network/types/interfaces";
import { convertToFixed18 } from "@acala-network/app-util";
import { TimestampedValue } from "@open-web3/orml-types/interfaces";

import {
  tokenEq,
  getValueFromTimestampValue
} from "@honzon-platform/react-components";

import { useApi } from "./useApi";
import { useCall } from "./useCall";
import { useStakingPool } from "./useStakingPool";

const insertPrice = (
  arr: DerivedPrice[],
  target: DerivedPrice
): DerivedPrice[] => {
  const index = arr.findIndex((item): boolean =>
    tokenEq(item.token, target.token)
  );

  if (index !== -1) {
    arr[index] = target;
  } else {
    arr.push(target);
  }

  return arr;
};

export const usePrice = (token?: CurrencyId | string) => {
  const { api } = useApi();
  const _price =
    useCall<DerivedPrice[]>((api.derive as any).price.allPrices, []) || [];
  const stakingPool = useStakingPool();
  const [price, setPrice] = useState<DerivedPrice[]>([]);

  useEffect(() => {
    if (!_price || _price.length === 0) {
      return;
    }

    let price: DerivedPrice[] = [];
    _price.forEach((item): void => {
      price.push(item);
    });

    // L-DOT price
    if (stakingPool) {
      const stakingCurrencyPrice = _price.find(item =>
        tokenEq(item.token, stakingPool.stakingPool.stakingCurrency)
      );
      const exchangeRate = stakingPool.stakingPoolHelper.liquidExchangeRate;

      if (stakingCurrencyPrice && exchangeRate) {
        const liquidPrice = convertToFixed18(
          getValueFromTimestampValue(stakingCurrencyPrice.price)
        ).mul(exchangeRate);
        const _TimestampedValue = api.registry.get("TimestampedValue")!;
        insertPrice(price, {
          token: stakingPool.stakingPool.liquidCurrency.toString(),
          price: new _TimestampedValue(api.registry, {
            value: liquidPrice.innerToString()
          }) as TimestampedValue
        });
      }
    }

    setPrice(price);
  }, [_price]);

  if (token && price) {
    return price.find((item: DerivedPrice) => item.token === token.toString());
  }

  return price;
};
