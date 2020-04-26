import React, { createContext, FC, useState } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';

type LoanTab = 'overview' | 'create' | (CurrencyId | string);

interface LoanContextData {
  currentTab: LoanTab;
  setCurrentTab: (tab: LoanTab) => void;
  showOverview: () => void;
  showCreate: () => void;
}

export const LoanContext = createContext<LoanContextData>({} as LoanContextData);

export const LoanProvider: FC<BareProps> = ({
  children
}) => {
  const [currentTab, setCurrentTab] = useState<LoanTab>('overview');

  const showOverview = () => {
    setCurrentTab('overview');
  };

  const showCreate = () => {
    console.log('??')
    setCurrentTab('create');
  };

  return (
    <LoanContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        showCreate,
        showOverview
      }}
    >
      {children}
    </LoanContext.Provider>
  );
}
