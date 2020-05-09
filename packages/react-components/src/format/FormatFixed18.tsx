import React, { FC, memo, ReactElement } from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@honzon-platform/ui-components/types';
import { thousandth, padEndDecimal } from '../utils';

import classes from './format.module.scss';

interface Props extends BareProps {
  data: Fixed18;
  format?: 'percentage' | 'number' | 'thousandth';
  prefix?: string;
  primary?: boolean;
  withTooltip?: boolean;
  withPadEndDecimal?: boolean;
}

export const FormatFixed18: FC<Props> = memo(({
  className,
  data,
  format = 'thousandth',
  prefix,
  primary = false,
  withTooltip = true,
  withPadEndDecimal = false
}) => {
  if (!data) {
    return null;
  }

  const getRenderText = (): string => {
    if (data.isNaN()) {
      return data.toString();
    }

    if (format === 'number') {
      return withPadEndDecimal ? padEndDecimal(data.toString(), 5) : data.toString();
    }

    if (format === 'thousandth') {
      return withPadEndDecimal ? padEndDecimal(thousandth(data.toNumber()), 5) : thousandth(data.toNumber());
    }

    if (format === 'percentage') {
      return data.mul(Fixed18.fromNatural(100)).toString(2, 3) + '%';
    }

    return '';
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
        {prefix || null}
        {getRenderText()}
      </span>
  );

  if (withTooltip) {
    return (
      <Tooltip
        arrow
        title={data.toString(18, 3)}
        placement='left'
      >
        {
          inner()
        }
      </Tooltip>
    );
  }

  return inner();

});

FormatFixed18.displayName = 'FormatFixed18';
