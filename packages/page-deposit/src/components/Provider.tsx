import React, { createContext, memo, FC, useState, useMemo, useCallback, useContext } from 'react';
import { ACTION_TYPE } from '../types';
import { BareProps } from '@honzon-platform/ui-components/types';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { useApi } from '@honzon-platform/react-hooks';
import { Vec } from '@polkadot/types';
import { globalStoreContext } from '@honzon-platform/react-environment';

interface DepositContextData {
  action: ACTION_TYPE;
  setActiveAction: (type: ACTION_TYPE) => void;
  enabledCurrencyIds: Vec<CurrencyId>;
  baseCurrencyId: CurrencyId;
  exchangeFee: Rate;
}

export const DepositContext = createContext<DepositContextData>({} as DepositContextData);

export const DepositProvider: FC<BareProps> = memo(({ children }) => {
  const { api } = useApi();
  const [action, _setAction] = useState<ACTION_TYPE>('deposit');
  const { store } = useContext(globalStoreContext);

  const enabledCurrencyIds = useMemo(() => api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>, [api]);

  const baseCurrencyId = useMemo(() => api.consts.dex.getBaseCurrencyId as CurrencyId, [api]);

  const exchangeFee = useMemo(() => api.consts.dex.getExchangeFee as Rate, [api]);

  const setActiveAction = useCallback((type: ACTION_TYPE): void => {
    _setAction(type);
  }, [_setAction]);

  return (
    <DepositContext.Provider value={{
      action,
      baseCurrencyId,
      enabledCurrencyIds,
      exchangeFee,
      setActiveAction
    }}>
      {children}
    </DepositContext.Provider>
  );
});

DepositProvider.displayName = 'DepositProvider';
