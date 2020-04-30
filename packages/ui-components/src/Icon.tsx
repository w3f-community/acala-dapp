import React from 'react';

import { ReactComponent as CopyIcon } from './assets/copy.svg';
import { ReactComponent as SwapIcon } from './assets/swap.svg';

export { CopyIcon, SwapIcon };

export type IconType = 'copy' | 'swap';

export const getIcon = (name: IconType) => {
  if (name === 'copy') {
    return <CopyIcon />
  }
  if (name === 'swap') {
    return <SwapIcon />
  }
};
