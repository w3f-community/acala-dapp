import React, { FC, PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

import classes from './NotificationDisplay.module.scss';
import { NotificationConfig } from './types';
import clsx from 'clsx';

const NotificationPortal: FC<PropsWithChildren<{}>> = ({ children }) => {
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const $body = document.querySelector('body')!;
  const $div = document.createElement('div');

  $div.classList.add('notification--root');

  useEffect((): () => void => {
    $body.append($div);

    return (): void => { $body.removeChild($div); };
  }, [$body, $div]);

  return createPortal(children, $div);
};

const NotificationCard: FC<NotificationConfig> = (config) => {
  return (
    <div className={clsx(classes.root, classes[config.type || 'info'])}>
      <div className={classes.icon}>{config.icon}</div>
      <div className={classes.content}>
        <div className={classes.title}>{config.title}</div>
        <div className={classes.info}>{config.content}</div>
      </div>
    </div>
  );
};

export const NotificationDisplay: FC<{ data: NotificationConfig[] }> = ({ data }) => {
  return (
    <NotificationPortal>
      {
        data.map((item) => {
          return (
            <NotificationCard
              key={`notification-${item.id}`}
              {...item}
            />
          );
        })
      }
    </NotificationPortal>
  );
};
