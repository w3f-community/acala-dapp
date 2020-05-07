import React, { FC, ReactNode, useContext } from 'react';
import { Tabs, TabConfig } from '@honzon-platform/ui-components';
import { CouncilOverview } from './CouncilOverview';
import { governanceContext } from './provider';
import { PageType } from './type';

export const PageTypeSelector: FC = () => {
  const { pageType, setPageType } = useContext(governanceContext);

  const tabsConfig: TabConfig[] = [
    {
      value: 'council',
      title: 'Council overview',
    },
    {
      value: 'motions',
      title: 'Motions',
    }
  ];

  const handleChange = (active: TabConfig) => {
    setPageType(active.value as PageType);
  }

  return (
    <Tabs
      config={tabsConfig}
      style='normal'
      onChange={handleChange}
    />
  );
}