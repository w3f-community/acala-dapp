import React, { createContext, FC, useState } from "react";
import { PageType } from "./type";
import { BareProps } from "@honzon-platform/ui-components/types";

interface GovernanceContextData {
  pageType: PageType;
  setPageType: (type: PageType) => void;
  councilType: string;
  setCouncilType: (council: string) => void;
}

export const governanceContext = createContext<GovernanceContextData>({} as GovernanceContextData);

export const GovernanceProvider: FC<BareProps> = ({ children }) => {
  const [pageType, setPageType] = useState<PageType>('council');
  const [councilType, setCouncilType] = useState<string>('');

  return (
    <governanceContext.Provider value={{
      pageType,
      setPageType,
      councilType,
      setCouncilType,
    }}>
      {children}
    </governanceContext.Provider>
  );
}

