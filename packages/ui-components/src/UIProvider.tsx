import { FC, ReactElement } from 'react';

import './styles/index.scss';
import './styles/global.css';

export const UIProvider: FC = ({ children }) => {
  return children as ReactElement;
};
