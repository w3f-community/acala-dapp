import React, { FC, PropsWithChildren, cloneElement, createElement, ReactElement } from 'react';

import './styles/index.scss';
import './styles/global.css';

export const UIProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return children;
};
