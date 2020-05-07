import React, { FC, memo, CSSProperties, ReactElement } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Grid.module.scss';

interface Props extends BareProps {
  container?: boolean;
  item?: boolean;
  flex?: number;
  direction?: 'column' | 'row';
  padding?: number;
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  pDirection?: 'column' | 'row';
  pGutter?: number;
}

export const Grid: FC<Props> = memo(({
  alignItems,
  children,
  className,
  container,
  direction = 'row',
  flex,
  padding = 24,
  item,
  justifyContent,
  pDirection,
  pGutter
}) => {
  const getStyle = (): CSSProperties => {
    const _style = {} as CSSProperties;

    if (pDirection === 'row' && item) {
      _style.marginLeft = padding || pGutter;
    }

    if (pDirection === 'column' && item) {
      _style.marginTop = padding || pGutter;
    }

    if (direction === 'row' && container) {
      _style.marginLeft = -padding || -(pGutter || 0);
    }

    if (direction === 'column' && container) {
      _style.marginTop = -padding || -(pGutter || 0);
    }

    if (flex) {
      _style.width = `${100 / 24 * flex}%`;
    }

    if (justifyContent) {
      _style.justifyContent = justifyContent;
    }

    if (alignItems) {
      _style.alignItems = alignItems;
    }

    return _style;
  };

  return (
    <div
      className={
        clsx(
          className,
          {
            [classes.root]: container,
            [classes[direction]]: container
          }
        )
      }
      style={getStyle()}
    >
      {
        React.Children.map(children, (node) => {
          if (!node) {
            return null;
          }

          if (item && !container) {
            return node;
          }

          const _props = {
            pDirection: direction,
            pGutter: padding
          } as any;

          return React.cloneElement(node as ReactElement, _props);
        })
      }
    </div>
  );
});

Grid.displayName = 'Grid';
