import { useState, useCallback } from 'react';

interface ReturnData {
  close: () => void;
  open: () => void;
  status: boolean;
  toggle: () => void;
}

export const useModal = (defaultStatus = false): ReturnData => {
  const [status, setStatus] = useState<boolean>(defaultStatus);
  const open = useCallback((): void => setStatus(true), []);
  const close = useCallback((): void => setStatus(false), []);
  const toggle = useCallback((): void => setStatus(!status), []);

  return { close, open, status, toggle };
};
