import { useContext } from 'react'
import { NotificationContext } from '@honzon-platform/ui-components';

export const useNotification = () => {
  const data = useContext(NotificationContext);
  return data;
}