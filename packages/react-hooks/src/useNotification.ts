import { useContext } from 'react';
import { NotificationContext } from '@acala-dapp/ui-components';
import { NotificationContextData } from '@acala-dapp/ui-components/Notification/context';

export const useNotification = (): NotificationContextData => {
  const data = useContext(NotificationContext);

  return data;
};
