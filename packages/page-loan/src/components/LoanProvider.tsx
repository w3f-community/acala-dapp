import React, { createContext, FC, useState, useRef } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';

type LoanTab = 'overview' | 'create' | (CurrencyId | string);

interface LoanContextData {
  currentTab: LoanTab;
  setCurrentTab: (tab: LoanTab) => void;
  cancelCurrentTab: () => void;
  showOverview: () => void;
  showCreate: () => void;
}

export const LoanContext = createContext<LoanContextData>({} as LoanContextData);

export const LoanProvider: FC<BareProps> = ({
  children
}) => {
  const prevTabRef = useRef<LoanTab>('overview');
  const [currentTab, _setCurrentTab] = useState<LoanTab>('overview');

  const setCurrentTab = (tab: LoanTab) => {
    prevTabRef.current = currentTab;
    _setCurrentTab(tab);
  };

  const showOverview = () => {
    setCurrentTab('overview');
  };

  const showCreate = () => {
    prevTabRef.current = currentTab;
    setCurrentTab('create');
  };

  const cancelCurrentTab = () => {
    setCurrentTab(prevTabRef.current);
  }

  return (
    <LoanContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        showCreate,
        showOverview,
        cancelCurrentTab
      }}
    >
      {children}
    </LoanContext.Provider>
  );
}
