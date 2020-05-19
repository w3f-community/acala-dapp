import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CopyToClipboard from 'react-copy-to-clipboard';

import { useNotification } from '@honzon-platform/react-hooks';
import { BareProps } from './types';
import classes from './Copy.module.scss';

interface Props extends BareProps {
  text: string;
  display?: string;
  render?: () => ReactNode;
  withCopy?: boolean;
}

export const Copy: FC<Props> = ({
  className,
  display,
  render,
  text,
  withCopy = true
}) => {
  const { createNotification } = useNotification();

  const handleCopy = (): void => {
    createNotification({
      icon: 'success',
      removedDelay: 2000,
      title: `Copy ${display || text} success`
    });
  };

  return (
    <span className={clsx(classes.root, className)}>
      { render ? render() : text }
      {
        withCopy ? (
          <CopyToClipboard onCopy={handleCopy}
            text={text}
          >
            <FileCopyOutlinedIcon />
          </CopyToClipboard>
        ) : null
      }
    </span>
  );
};
