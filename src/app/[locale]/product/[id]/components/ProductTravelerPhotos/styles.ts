export const styles = {
  root: 'flex flex-col',
  title: 'text-h2 mb-md',
  photosList: 'flex gap-sm',
  photo: 'rounded-[12px] h-[108px] w-[108px] object-cover',
  overlayContainer:
    'relative h-full min-h-[108px]  max-h-[108px] w-[108px] flex items-center justify-center rounded-xl overflow-hidden',
  blurOverlay: 'absolute inset-0 bg-black bg-opacity-60 backdrop-blur-[1px] z-10',
  blurImageWrapper: 'absolute h-full inset-0 filter',
  seeMoreText: 'left-3 max-w-[90px] absolute text-white text-text font-bold z-20',
};
