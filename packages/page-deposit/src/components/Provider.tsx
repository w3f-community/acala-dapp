import React, { createContext, memo, FC, useState } from 'react';
import { ACTION_TYPE } from '../types';
import { BareProps } from '@honzon-platform/ui-components/types';
import { CurrencyId, Share, Rate } from '@acala-network/types/interfaces';
import { useApi, useAccounts, useCall } from '@honzon-platform/react-hooks';
import { Vec } from '@polkadot/types';

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
  const { active } = useAccounts();
  const [action, _setAction] = useState<ACTION_TYPE>('reward');
  const setActiveAction = (type: ACTION_TYPE): void => {
    _setAction(type);
  };
  const enabledCurrencyIds = api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>;
  const baseCurrencyId = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const exchangeFee = api.consts.dex.getExchangeFee as Rate;

  return (
    <DepositContext.Provider value={{
      action,
      baseCurrencyId,
      enabledCurrencyIds,
      exchangeFee,
      setActiveAction,
    }}>
      {children}
    </DepositContext.Provider>
  );
});

DepositProvider.displayName = 'DepositProvider';
