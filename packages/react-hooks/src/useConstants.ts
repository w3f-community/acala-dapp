import { useApi } from "./useApi";
import { CurrencyId } from "@acala-network/types/interfaces";

export const useConstants = () => {
    const { api } = useApi();
    return {
      stableCurrency: api.consts.cdpEngine.getStableCurrencyId as CurrencyId
    }
};