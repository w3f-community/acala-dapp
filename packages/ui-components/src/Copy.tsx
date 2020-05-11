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
  text,
  render,
  withCopy = true
}) => {
  const { createNotification } = useNotification();

  const handleCopy = () => {
    createNotification({
      icon: 'success',
      title: `Copy ${display ? display : text} success`,
      removedDelay: 2000,
    });
  };

  return (
    <span className={clsx(classes.root, className)}>
      { render ? render() : text }
      {
        withCopy ? (
          <CopyToClipboard text={text}
            onCopy={handleCopy}
          >
            <FileCopyOutlinedIcon />
          </CopyToClipboard>
        ) : null
      }
    </span>
  );
};
