import React, { FC } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { Copy } from '@honzon-platform/ui-components';

import { formatHash } from '../utils';

interface Props {
  hash: string;
  withCopy?: boolean;
  withTooltip?: boolean;
}

export const FormatHash: FC<Props> = ({
  hash,
  withCopy = true,
  withTooltip = true
}) => {
  const renderInner = () => {
    if (withTooltip) {
      return (
        <Tooltip
          arrow
          title={hash}
          placement='left'
        >
          <span>{formatHash(hash)}</span>
        </Tooltip>
      );
    }

    return <span>formatHash(hash)</span>
  };
  return (
    <Copy
      text={hash}
      display={formatHash(hash)}
      render={renderInner}
      withCopy={withCopy}
    />
  );
};
