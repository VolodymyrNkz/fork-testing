import { FC } from 'react';
import { IconProps } from '@/app/_icons/types';

export const SearchIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.1246 20 15.0784 19.2628 16.6176 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.0319 16.6176C19.2628 15.0784 20 13.1246 20 11C20 6.02944 15.9706 2 11 2ZM4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.9299 17.2203 14.6758 15.9563 15.9432C14.688 17.2149 12.9366 18 11 18C7.13401 18 4 14.866 4 11Z"
    />
  </svg>
);
