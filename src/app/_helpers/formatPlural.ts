export const formatPlural = (count: number, text: string): string => {
  if (count === 1) {
    return text;
  }
  return `${text}s`;
};
