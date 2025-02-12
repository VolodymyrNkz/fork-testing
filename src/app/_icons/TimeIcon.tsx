import React from 'react';
import { IconProps } from '@/app/_icons/types';

const TimeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99999 3.83335C8.36818 3.83335 8.66666 4.13183 8.66666 4.50002L8.66666 7.83335H12C12.3682 7.83335 12.6667 8.13183 12.6667 8.50002C12.6667 8.86821 12.3682 9.16669 12 9.16669H7.99999C7.6318 9.16669 7.33332 8.86821 7.33332 8.50002L7.33332 4.50002C7.33332 4.13183 7.6318 3.83335 7.99999 3.83335Z"
      fill="#495B69"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99999 2.50002C4.68628 2.50002 1.99999 5.18631 1.99999 8.50002C1.99999 11.8137 4.68628 14.5 7.99999 14.5C11.3137 14.5 14 11.8137 14 8.50002C14 5.18631 11.3137 2.50002 7.99999 2.50002ZM0.666656 8.50002C0.666656 4.44993 3.9499 1.16669 7.99999 1.16669C12.0501 1.16669 15.3333 4.44993 15.3333 8.50002C15.3333 12.5501 12.0501 15.8334 7.99999 15.8334C3.9499 15.8334 0.666656 12.5501 0.666656 8.50002Z"
      fill="#495B69"
    />
  </svg>
);

export default TimeIcon;
