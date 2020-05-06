import React, { FC } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { formatHash } from '../utils';

interface Props {
  hash: string;
}

export const FormatHash: FC<Props> = ({
  hash
}) => {
  return (
    <Tooltip
      arrow
      placement='top'
      title={hash}
    >
      <span>
        {
          formatHash(hash)
        }
      </span>
    </Tooltip>
  );
};
