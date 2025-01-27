export const styles = {
  container: 'grid h-[224px] grid-cols-3 grid-rows-2 gap-2',
  singleGrid: 'grid h-[224px] grid-cols-1 grid-rows-1 gap-2',
  largeImageWrapper: 'col-span-2 row-span-2',
  smallImageWrapper: 'col-span-1 row-span-1 relative',
  tallImageWrapper: 'col-span-1 row-span-2 relative',
  image: 'h-full w-full rounded-xl object-cover',
  overlayContainer:
    'relative h-full w-full flex items-center justify-center rounded-xl overflow-hidden',
  blurOverlay: 'absolute inset-0 bg-black bg-opacity-60 backdrop-blur-[1px] z-10',
  blurImageWrapper: 'absolute inset-0 filter blur-[2px]',
  seeMoreText: 'absolute text-white text-lg font-bold z-20',
};
