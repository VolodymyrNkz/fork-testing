export const styles = {
  root: 'mt-xxl',
  container: 'relative overflow-y-scroll shadow-[inset_0px_-10px_10px_-10px_rgba(255,255,255,1)]',
  review:
    '[&:not(:last-child)]:mb-lg [&:not(:last-child)]:border-b border-disabled [&:not(:last-child)]:pb-lg',
  reviewHeader: 'flex justify-between mb-md',
  aboutReview: 'flex flex-col',
  userInfo: 'flex gap-md',
  userAvatar: 'rounded-full',
  textBold: 'text-text font-[600]',
  avatarIcon: 'min-w-[40px] h-[40px]',
  publishedDate: 'text-light',
  ratingSection: 'text-light',
  userRating: 'text-h3 font-[600]',
  reviewText: 'text-light',
  bottomGradient: 'sticky bottom-0 h-10 w-full bg-gradient-to-t from-white to-transparent',
  button: 'mt-xxl p-sm border border-borderDark flex justify-center items-center w-full rounded-md',
  photosList: 'flex mb-md',
  photoContainer:
    'relative w-[50px] h-[50px] rounded-lg overflow-hidden -ml-3 first:ml-0 shadow-[0px_1.52px_4.56px_0px_rgba(0,0,0,0.2)]',
  photo: 'object-cover',
  overlay:
    'absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-bold',
};
