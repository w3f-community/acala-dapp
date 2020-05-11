import React, { FC, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useApi } from '@honzon-platform/react-hooks';

export const EventsWather: FC = () => {
  const { api } = useApi();

  useEffect(() => {
    if (isEmpty(api)) {
      return;
    }

    api.query.system.events(function (events) {
      events.map((event) => {
        // console.log(event.toHuman());
      })
    });
  }, [api]);
  return <></>;
}