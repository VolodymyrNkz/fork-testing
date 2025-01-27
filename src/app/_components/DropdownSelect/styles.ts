export const styles = {
  container: 'relative inline-block  max-w-xs',
  button:
    'flex items-center justify-between w-full px-sm py-xs border rounded-md border-borderDark  shadow-sm focus:outline-none',
  label: 'text-helperText font-medium text-textPrimary',
  arrow: 'h-[12px] ml-sm transform rotate-90 transition-transform duration-300',
  arrowOpen: 'h-[12px]  ml-sm transform rotate-[-90deg] transition-transform duration-300',
  dropdown:
    'w-fit right-0 absolute mt-2 bg-white border border-borderPrimary overflow-hidden rounded-md shadow-lg z-10',
  option: 'border-b px-4 py-2 text-base text-textPrimary hover:bg-gray-100 cursor-pointer',
  selectedOption: 'bg-primary text-white',
};
