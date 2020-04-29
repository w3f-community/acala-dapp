import React, { FC, memo, ReactNode } from 'react';

import { BareProps } from './types';
import classes from './Step.module.scss';
import clsx from 'clsx';

export interface StepConfig {
  index: number | string;
  text: ReactNode;
}

interface Props extends BareProps {
  config: StepConfig[];
  current: number | string;
}

export const Step: FC<Props> = memo(({
  className,
  config,
  current
}) => {
  return (
    <ul className={
      clsx(classes.root, className)
    }>
      {
        config.map((item, index) => {
          return (
            <li
              key={`step-${item.index}-${item.text}`}
              className={clsx(
                classes.item,
                {
                  [classes.active]: item.index === current || index === 0
                }
              )}
            >
              <span className={classes.point}>{index + 1 }</span>
              <span className={classes.text}>{item.text}</span>
            </li>
          );
        })
      }
    </ul>
  );
});

Step.displayName = 'Step';
