import { ReactNode } from 'react';

type Placement = 'top left' | 'top right' | 'bottom left' | 'bottom right';

export interface NotificationConfig {
  id: number;
  icon?: ReactNode;
  title?: ReactNode;
  content: ReactNode;
  placement: Placement;
  removedDelay?: number;
  remove: (delay?: number) => void;
  update: (config: Partial<NotificationConfig>) => void;
}

export interface PartialNotificationConfig {
  icon?: ReactNode;
  title?: ReactNode;
  content: ReactNode;
  placement: Placement;
}
