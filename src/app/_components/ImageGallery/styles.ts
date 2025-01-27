export const styles = {
  filtersSection:
    'flex gap-xs overflow-x-scroll w-full whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  title: 'text-h3 mb-lg',
  photosSection: 'mt-xxl mb-xl',
  grid: `
    grid grid-cols-2 gap-sm
  `,
  imageWrapper: 'flex-grow',
  image: 'w-full h-full object-cover rounded-md',
  selected: 'border-2 border-textPrimary bg-disabled',
};
