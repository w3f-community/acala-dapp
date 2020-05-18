import React, { createContext, FC, useState, useRef, useEffect, useCallback } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useInitialize, useAllLoans } from '@honzon-platform/react-hooks';
import { PageLoading } from '@honzon-platform/ui-components';

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
  }, [_setCurrentTab]);

  const showOverview = useCallback(() => {
    setCurrentTab('overview');
  }, [setCurrentTab]);

  const showCreate = useCallback(() => {
    prevTabRef.current = currentTab;
    setCurrentTab('create');
  }, [setCurrentTab]);

  const cancelCurrentTab = useCallback(() => {
    setCurrentTab(prevTabRef.current);
  }, [setCurrentTab]);

  useEffect(() => {
    if (loans) {
      setEnd();
    }
  }, [loans]);

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
      {
        isInitialized ? children : <PageLoading />
      }
    </LoanContext.Provider>
  );
};
