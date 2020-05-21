import React, { FC, ReactElement } from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@acala-dapp/ui-components/types';

import { thousand, padDecimalPlaces } from '../utils';
import classes from './format.module.scss';

interface Props extends BareProps {
  data?: Fixed18;
  format?: 'percentage' | 'number' | 'thousand';
  prefix?: string;
  primary?: boolean;
  withTooltip?: boolean;
  withpadDecimalPlaces?: boolean;
}

export const FormatFixed18: FC<Props> = ({
  className,
  data,
  format = 'thousand',
  prefix,
  primary = false,
  withTooltip = true,
  withpadDecimalPlaces = false
}) => {
  if (!data) {
    return null;
  }

  const getRenderText = (): string => {
    let _text = '';

    if (!data.isFinity()) {
      return 'NaN';
    }

    if (format === 'number') {
      _text = withpadDecimalPlaces ? padDecimalPlaces(data.toString(6, 3), 6) : data.toString();
    }

    if (format === 'thousand') {
      _text = withpadDecimalPlaces ? padDecimalPlaces(thousand(data.toNumber(6, 3)), 6) : thousand(data.toNumber(6, 3));
    }

    if (format === 'percentage') {
      _text = data.mul(Fixed18.fromNatural(100)).toString(2, 3) + '%';
    }

    return `${prefix || ''}${_text}`;
  };

  const inner = (): ReactElement => (
    <span
      className={
        clsx(
          className,
          {
            [classes.primary]: primary
          }
        )

      }
    >
      {getRenderText()}
    </span>
  );

  if (withTooltip) {
    return (
      <Tooltip
        arrow
        placement='left'
        title={data.toString(18, 3)}
      >
        {
          inner()
        }
      </Tooltip>
    );
  }

  return inner();
};
