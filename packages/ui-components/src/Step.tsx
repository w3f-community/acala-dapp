import React, { FC, memo, ReactNode } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Step.module.scss';
import { ReactComponent as CheckedIcon } from './assets/checked.svg';

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

  const isDone = (index: number): boolean => {
    const currentArrayIndex = config.findIndex((item): boolean => item.index === current); 
    return index < currentArrayIndex;
  };

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
                  [classes.active]: item.index === current,
                  [classes.done]: isDone(index)
                }
              )}
            >
              <span className={classes.point}>
                {
                  isDone(index) ? (
                      <CheckedIcon />
                  ) : index + 1
                }
              </span>
              <span className={classes.text}>{item.text}</span>
            </li>
          );
        })
      }
    </ul>
  );
});

Step.displayName = 'Step';
