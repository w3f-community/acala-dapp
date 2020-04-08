import { useState } from 'react';

interface ReturnData {
  close: () => void;
  open: () => void;
  status: boolean;
  toggle: () => void;
}

export const useModal = (defaultStatus = false): ReturnData => {
  const [status, setStatus] = useState<boolean>(defaultStatus);
  const open = (): void => setStatus(true);
  const close = (): void => setStatus(false);
  const toggle = (): void => setStatus(!status);

  return { close, open, status, toggle };
};
