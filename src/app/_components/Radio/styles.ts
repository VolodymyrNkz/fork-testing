export const styles = {
  root: 'flex items-center gap-xs w-fit cursor-pointer',
  radio:
    'relative flex h-[24px] w-[24px] items-center justify-center rounded-full border border-borderDark transition',
  radioChecked: 'bg-textPrimary',
  radioInner:
    'border-none before:content-[""] before:w-[8px] before:h-[8px] before:bg-white before:absolute before:rounded-full before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2',
  label: 'text-text',
  disabled: 'pointer-events-none bg-disabled',
};
