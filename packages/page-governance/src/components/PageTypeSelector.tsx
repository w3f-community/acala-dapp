import React, { FC, useContext } from 'react';
import { Tabs, TabConfig } from '@honzon-platform/ui-components';
import { governanceContext } from './provider';
import { PageType } from './type';

export const PageTypeSelector: FC = () => {
  const { setPageType } = useContext(governanceContext);

  const tabsConfig: TabConfig[] = [
    {
      title: 'Council overview',
      value: 'council'
    },
    {
      title: 'Motions',
      value: 'motions'
    }
  ];

  const handleChange = (active: TabConfig): void => {
    setPageType(active.value as PageType);
  };

  return (
    <Tabs
      config={tabsConfig}
      onChange={handleChange}
      style='normal'
    />
  );
};
