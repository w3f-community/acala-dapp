import { useState, useCallback } from "react";

export const useInitialize = () => {
  const [status, setStatus] = useState<boolean>(false);

  const setEnd = useCallback(() => {
    setStatus(true);
  }, [setStatus]);

  return { isInitialized: status, setEnd };
};
