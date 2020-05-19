import React, { FC, ReactNode } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { Copy } from '@honzon-platform/ui-components';

import { formatHash } from '../utils';

interface Props {
  hash: string;
  withCopy?: boolean;
  withTooltip?: boolean;
  withPScan?: boolean;
}

function getPScanUrl (hash: string): string {
  return `https://acala-testnet.subscan.io/extrinsic/${hash}`;
}

export const FormatHash: FC<Props> = ({
  hash,
  withCopy = true,
  withPScan = true,
  withTooltip = true
}) => {
  const renderInner = (): ReactNode => {
    if (withTooltip) {
      return (
        <Tooltip
          arrow
          placement='left'
          title={hash}
        >
          {
            withPScan ? <a href={getPScanUrl(hash)}
              rel='noopener noreferrer'
              target='_blank'>{formatHash(hash)}</a> : <span>{formatHash(hash)}</span>
          }
        </Tooltip>
      );
    }

    return <span>formatHash(hash)</span>;
  };

  return (
    <Copy
      display={formatHash(hash)}
      render={renderInner}
      text={hash}
      withCopy={withCopy}
    />
  );
};
