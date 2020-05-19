import React, { FC, useContext } from 'react';
import { upperFirst } from 'lodash';
import { Tabs, TabConfig } from '@honzon-platform/ui-components';
import { useCouncilList } from '@honzon-platform/react-hooks';
import { governanceContext } from './provider';

export const CouncilSelector: FC = () => {
  const councilList = useCouncilList();
  const { setCouncilType } = useContext(governanceContext);

  const tabsConfig: TabConfig[] = councilList.map((item: string) => {
    return {
      title: upperFirst(item),
      value: item
    };
  });

  const handleChange = (active: TabConfig): void => {
    setCouncilType(active.value || '');
  };

  return (
    <Tabs
      config={tabsConfig}
      onChange={handleChange}
      style='button'
    />
  );
};
