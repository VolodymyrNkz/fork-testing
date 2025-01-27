import React from 'react';
import { IconProps } from '@/app/_icons/types';

export const CrossIconRounded: React.FC<IconProps> = ({ className, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    onClick={onClick}
  >
    <g clipPath="url(#clip0_706_1871)">
      <g clipPath="url(#clip1_706_1871)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.00002 0.666687C3.94993 0.666687 0.666687 3.94993 0.666687 8.00002C0.666687 12.0501 3.94993 15.3334 8.00002 15.3334C12.0501 15.3334 15.3334 12.0501 15.3334 8.00002C15.3334 3.94993 12.0501 0.666687 8.00002 0.666687ZM5.76067 5.76085C5.95594 5.56559 6.27252 5.56559 6.46778 5.76085L7.99982 7.29289L9.53189 5.76085C9.72715 5.56559 10.0438 5.56559 10.239 5.76085C10.4343 5.95611 10.4343 6.27269 10.239 6.46795L8.70695 8.00002L10.239 9.53209C10.4343 9.72735 10.4343 10.044 10.239 10.2392C10.0438 10.4345 9.72715 10.4345 9.53189 10.2392L7.99982 8.70715L6.46778 10.2392C6.27252 10.4345 5.95594 10.4345 5.76067 10.2392C5.56541 10.044 5.56541 9.72735 5.76067 9.53209L7.29275 8.00002L5.76067 6.46795C5.56541 6.27269 5.56541 5.95611 5.76067 5.76085Z"
          fill="currentColor"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_706_1871">
        <rect width="16" height="16" fill="white" />
      </clipPath>
      <clipPath id="clip1_706_1871">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
