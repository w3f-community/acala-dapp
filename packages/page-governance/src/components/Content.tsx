import React, { FC, useContext } from 'react';

import { governanceContext } from './provider';
import { CouncilMembers } from './CouncilMembers';
import { CouncilMotions } from './CouncilMotions';

export const Content: FC = () => {
  const { councilType, pageType } = useContext(governanceContext);

  if (!pageType || !councilType) {
    return null;
  }

  if (pageType === 'council') {
    return <CouncilMembers council={councilType} />;
  }

  if (pageType === 'motions') {
    return <CouncilMotions council={councilType} />;
  }

  return null;
};
