import React, { FC, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useApi } from '@acala-dapp/react-hooks';

export const EventsWather: FC = () => {
  const { api } = useApi();

  useEffect(() => {
    if (isEmpty(api)) {
      return;
    }

    api.query.system.events(function (events) {
      events.map(() => {
        // console.log(event.toHuman());
      });
    });
  }, [api]);

  return <></>;
};
