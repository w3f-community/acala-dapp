import { useState, useEffect, useCallback } from "react";

export function useInterval<T> (callback: () => Promise<T> | T, interval: number, immediately?: boolean): T | null {
  const [data, setData] = useState<T | null>(null);

  const _exec = useCallback(async () => {
    const result = await callback();
    setData(result);
  }, [callback, interval, immediately]);

  useEffect(() => {
    if (immediately) {
      _exec();
    }

    const _i = setInterval(_exec, interval);

    return () => {
      clearInterval(_i);
    };
  }, [_exec, immediately]);

  return data;
}