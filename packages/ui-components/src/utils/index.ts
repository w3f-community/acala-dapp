export const randomID = (): string => {
  return Math.random().toString(16).slice(3);
};

export const nextTick = (fn: Function) => {
  setTimeout(fn, 0);
}