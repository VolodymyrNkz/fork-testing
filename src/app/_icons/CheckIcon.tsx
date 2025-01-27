import React, { FC } from 'react';
import { IconProps } from '@/app/_icons/types';

export const CheckIcon: FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
);
