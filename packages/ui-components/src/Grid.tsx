import React, { FC, memo, CSSProperties, ReactElement } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Grid.module.scss';
import { jsxAttribute } from '@babel/types';

interface Props extends BareProps {
  container?: boolean;
  item?: boolean;
  flex?: number;
  direction?: 'column' | 'row';
  gutter?: number;
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around',
  alignItems?: 'center' | 'flex-start' | 'flex-end',
  pDirection?: 'column' | 'row';
  pGutter?: number;
}

export const Grid: FC<Props> = memo(({
  alignItems,
  children,
  className,
  direction = 'row',
  gutter = 24,
  flex,
  item,
  container,
  justifyContent,
  pDirection,
  pGutter
}) => {
  const getStyle = (): CSSProperties => {
    const _style = {} as CSSProperties;

    if (pDirection === 'row' && item) {
      _style.marginLeft = gutter || pGutter;
    }

    if (pDirection === 'column' && item) {
      _style.marginTop = gutter || pGutter;
    }

    if (direction === 'row' && container) {
      _style.marginLeft = -gutter || -(pGutter || 0);
    }

    if (direction === 'column' && container) {
      _style.marginTop = -gutter || -(pGutter || 0);
    }

    if (flex) {
      console.log(flex);
      _style.flex = `0 0 ${100 / 24 * flex}%`;
    }

    if (justifyContent) {
      _style.justifyContent = justifyContent;
    }

    if (alignItems) {
      _style.alignItems = alignItems;
    }

    return _style;
  }

  return (
    <div
      className={
        clsx(
          className,
          {
            [classes.root]: container,
            [classes[direction]]: container,
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
          pGutter: gutter
        } as any;

        return React.cloneElement(node as ReactElement, _props);
      })
    }
    </div>
  );
});

Grid.displayName = 'Grid';