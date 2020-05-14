import React, { FC } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { Copy } from '@honzon-platform/ui-components';

import { formatHash } from '../utils';

interface Props {
  hash: string;
  withCopy?: boolean;
  withTooltip?: boolean;
  withPScan?: boolean;
}

function getPScanUrl (hash: string) {
  return `https://acala-testnet.subscan.io/extrinsic/${hash}`;
}

export const FormatHash: FC<Props> = ({
  hash,
  withCopy = true,
  withTooltip = true,
  withPScan = true
}) => {
  const renderInner = () => {
    if (withTooltip) {
      return (
        <Tooltip
          arrow
          title={hash}
          placement='left'
        >
          {
            withPScan ? <a href={getPScanUrl(hash)} target='_blank'>{formatHash(hash)}</a> : <span>{formatHash(hash)}</span>
          }
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
