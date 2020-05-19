import { useContext } from 'react';
import { NotificationContext } from '@honzon-platform/ui-components';
import { NotificationContextData } from '@honzon-platform/ui-components/Notification/context';

export const useNotification = (): NotificationContextData => {
  const data = useContext(NotificationContext);

  return data;
};
