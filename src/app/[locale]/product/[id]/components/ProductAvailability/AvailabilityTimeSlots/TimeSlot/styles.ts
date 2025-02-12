export const styles = {
  root: 'mt-xl flex flex-col rounded-md border border-disabled',
  rootSelected: 'border-[2px] border-textPrimary',
  disabled: 'text-textDisabled pb-md',
  content: 'p-md pt-0',
  selected: 'border-textPrimary',
  header: 'flex items-center gap-sm pt-md px-md',
  title: 'text-text font-bold',
  divider: 'w-full h-[1px] bg-disabled mt-md',
  radio: 'min-w-[24px] h-[24px] rounded-full border border-borderDark relative',
  radioDisabled: 'bg-disabled border-none',
  radioSelected:
    'bg-black border-none before:content-[""] before:w-[8px] before:h-[8px] before:bg-white before:absolute before:rounded-full before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2',
  timeSlotsWrapper: 'my-lg grid grid-cols-3 gap-sm',
  timeSlot:
    'flex justify-center items-center p-xs text-text border border-borderDark rounded-md text-center',
  timeSlotUnavailable: 'text-textDisabled bg-disabled border-none',
  timeSlotSelected: 'bg-secondary border-primary',
  priceSection: 'mt-lg  flex items-center justify-between',
  guests: 'text-text flex flex-col',
  totalPrice: 'self-end text-h3',
  description: 'mt-sm text-text',
  descriptionCollapsed: 'line-clamp-3 overflow-hidden',
  readMoreButton: 'flex gap-xs items-center text-primary text-text cursor-pointer mt-xs',
  arrowIcon: 'transform h-[12px] w-[12px]',
  buttonWrapper: 'border-t mt-md pt-md border-disabled',
};
