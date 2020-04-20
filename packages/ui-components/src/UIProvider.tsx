import React, { FC, PropsWithChildren, cloneElement, createElement, ReactElement } from 'react';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.scss';
import './styles/global.css';

export const UIProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return cloneElement(children as ReactElement);
};
