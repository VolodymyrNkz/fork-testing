export const styles = {
  container:
    'fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 transition-opacity duration-300',
  open: 'opacity-100 pointer-events-auto',
  closed: 'opacity-0 pointer-events-none',
  sheet:
    'w-full bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 max-h-[90vh]',
  sheetOpen: 'translate-y-0',
  sheetClosed: 'translate-y-full',
  header: 'p-lg flex justify-between items-center cursor-pointer',
  title: 'text-h4 m-auto truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]',
  content: 'px-lg py-md overflow-y-auto max-h-[60vh]',
  grabber: 'm-auto mt-sm w-[36px] h-[ 5px] bg-disabled rounded-sm',
  headerDivider: 'border-b border-disabled pb-lg px-lg',
  headerDividerHorizontal: 'border-t border-b border-disabled px-lg py-xs',
  footer:
    'bg-white z-10  flex w-full items-center justify-between border-t border-disabled px-lg py-md',
  borderBottom: 'border-b border-disabled',
};
