import React, { createContext, FC, useState, useRef, useEffect } from 'react';
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
  const { isEnd, setEnd } = useInitialize();

  useEffect(() => {
    if (loans) {
      setEnd();
    }
  }, [loans]);

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
  };

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
      {!isEnd ? <PageLoading />: children}
    </LoanContext.Provider>
  );
};
