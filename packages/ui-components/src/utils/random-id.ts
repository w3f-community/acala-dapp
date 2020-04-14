export const randomID = (): string => {
  return Math.random().toString(16).slice(3);
};
