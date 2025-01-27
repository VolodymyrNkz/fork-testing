import React from 'react';
import { IconProps } from '@/app/_icons/types';

const ArrowIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    width="9"
    height="16"
    viewBox="0 0 9 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.20838 15.0835C0.982549 15.0835 0.755879 14.9918 0.591711 14.811C0.28254 14.4702 0.307541 13.9435 0.647545 13.6335L6.84429 8.00342L0.647545 2.36585C0.307541 2.05668 0.28254 1.52917 0.592544 1.18917C0.902548 0.849164 1.43005 0.824164 1.76922 1.13417L8.64347 7.38758C8.81681 7.54508 8.91598 7.76925 8.91598 8.00342C8.91598 8.23842 8.81681 8.46259 8.64347 8.62009L1.76922 14.8668C1.60839 15.0118 1.40839 15.0835 1.20838 15.0835Z"
    />
  </svg>
);

export default ArrowIcon;
