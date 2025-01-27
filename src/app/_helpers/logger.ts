export function customLog<T extends Record<string, unknown>>(
  title: string,
  data?: T,
  color: 'primary' | 'secondary' = 'primary',
): void {
  const style = `color: ${color === 'primary' ? '#00665A' : '#E97101'}; font-weight: bold;`;

  if (data) {
    console.group(`%c${title}`, style);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    console.groupEnd();
  } else {
    console.log(`%c${title}`, `font-weight: bold`);
  }
}
