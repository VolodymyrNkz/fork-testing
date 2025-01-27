export const styles = {
  root: 'relative',
  value: 'truncate text-textSecondary text-button',
  list: 'absolute top-[-310px] max-h-[300px] overflow-y-auto rounded-md border border-disabled bg-white drop-shadow-xl',
  item: 'p-sm',
  input:
    'flex gap-sm items-center border border-disabled rounded-md px-sm py-mlg whitespace-nowrap', // Добавлено whitespace-nowrap
  icon: 'transform rotate-90 h-[12px] w-[12px]',
  iconOpen: 'rotate-90',
  iconClosed: '-rotate-90',
  star: 'text-error',
  selected: 'font-bold text-primary',
};
