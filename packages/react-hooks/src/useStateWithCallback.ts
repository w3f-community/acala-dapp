import { useState, useEffect, useRef } from "react";

export function useStateWithCallback<T> (init: T) {

  const [value, _setValue] = useState<T>(init);
  const _history = useRef<T>(init);
  const _callback = useRef<(value?: T) => void>();

  useEffect(() => {
    if (value !== _history.current) {
      _callback.current && _callback.current(value);
      _history.current = value;
    }
  }, [value]);

  const setValue = (value: any, callback?: (value?: T) => void) => {
    if (callback) {
      _callback.current = callback;
    }
    _setValue(value);
  };

  return [value, setValue] as [T, (data: T, callback?: (value?: T) => void) => void];
}