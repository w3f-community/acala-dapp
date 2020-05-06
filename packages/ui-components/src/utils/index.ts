export const randomID = (): string => {
  return Math.random().toString(16).slice(3);
};

export const nextTick = (fn: Function): void => {
  setTimeout(fn, 0);
};
