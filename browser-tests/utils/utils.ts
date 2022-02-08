export const removeEmpty = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] &&
        typeof obj[k] === 'object' &&
        removeEmpty(obj[k] as Record<string, unknown>)) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};
