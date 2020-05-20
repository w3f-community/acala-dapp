import React, { createContext, FC, useState, useRef, useEffect, useCallback } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useInitialize, useAllLoans } from '@acala-dapp/react-hooks';
import { PageLoading } from '@acala-dapp/ui-components';

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
  const { loans } = useAllLoans();
  const { isInitialized, setEnd } = useInitialize();

  const setCurrentTab = useCallback((tab: LoanTab) => {
    prevTabRef.current = currentTab;
    _setCurrentTab(tab);
  }, [currentTab]);

  const showOverview = useCallback(() => {
    setCurrentTab('overview');
  }, [setCurrentTab]);

  const showCreate = useCallback(() => {
    prevTabRef.current = currentTab;
    setCurrentTab('create');
  }, [currentTab, setCurrentTab]);

  const cancelCurrentTab = useCallback(() => {
    setCurrentTab(prevTabRef.current);
  }, [setCurrentTab]);

  useEffect(() => {
    if (loans.length !== 0) {
      setEnd();
    }
  }, [loans, setEnd]);

  return (
    <LoanContext.Provider
      value={{
        cancelCurrentTab,
        currentTab,
        setCurrentTab,
        showCreate,
        showOverview
      }}
    >
      {
        isInitialized ? children : <PageLoading />
      }
    </LoanContext.Provider>
  );
};
