export const styles = {
  trigger: 'inline-block cursor-pointer h-full',
  panel:
    'flex flex-col fixed bottom-0 left-0 w-full h-[100dvh] bg-white z-50 transition-transform duration-300 ease-in-out pt-[env(safe-area-inset-top)]',
  panelOpen: 'transform translate-y-0',
  panelClosed: 'transform translate-y-full',
  content: 'px-lg flex-1 overflow-y-auto relative w-full flex flex-col overflow-hidden',
  closeButton: 'flex justify-end text-black text-2xl cursor-pointer p-4 self-end',
  header: 'p-md flex items-center mb-md',
  icon: 'transform rotate-180',
  title: 'm-auto text-h4',
  footer: 'p-md border-t border-disabled',
};
