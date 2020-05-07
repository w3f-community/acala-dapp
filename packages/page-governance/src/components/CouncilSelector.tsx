import React, { FC, ReactNode, useContext } from 'react';
import { upperFirst } from 'lodash';
import { Tabs, TabConfig } from '@honzon-platform/ui-components';
import { CouncilOverview } from './CouncilOverview';
import { useCouncilList } from '@honzon-platform/react-hooks';
import { governanceContext } from './provider';

export const CouncilSelector: FC = () => {
  const councilList = useCouncilList();
  const { setCouncilType } = useContext(governanceContext);

  const tabsConfig: TabConfig[] = councilList.map((item: string) => {
    return {
      value: item,
      title: upperFirst(item),
    }
  });

  const handleChange = (active: TabConfig) => {
    setCouncilType(active.value || '');
  }

  return (
    <Tabs
      config={tabsConfig}
      style='button'
      onChange={handleChange}
    />
  );
}