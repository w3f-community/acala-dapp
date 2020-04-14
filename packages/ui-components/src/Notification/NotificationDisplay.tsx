import React, { FC, PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { NotificationConfig } from './types';

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

const NotificationCardRoot = styled('div')`
  margin: 8px 0 0 0;
  padding: 16px;
  width: 400px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(1, 50, 206, 0.08);
`;

const NotificationCard: FC<NotificationConfig> = (config) => {
  return (
    <NotificationCardRoot>
      <div className='notification--card--icon'>{config.icon}</div>
      <div className='notification--card--container'>
        <div className='notification--card--title'>{config.title}</div>
        <div className='notification--card--content'>{config.content}</div>
      </div>
    </NotificationCardRoot>
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
