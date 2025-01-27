import { FC } from 'react';
import { IconProps } from '@/app/_icons/types';

export const AvatarIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="11.5" fill="#BDDBD8" stroke="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.25 10.125C14.25 11.3655 13.2405 12.375 12 12.375C10.7595 12.375 9.75 11.3655 9.75 10.125V9C9.75 7.7595 10.7595 6.75 12 6.75C13.2405 6.75 14.25 7.7595 14.25 9V10.125ZM6.75 16.875C6.75 15.0135 8.2635 13.5 10.125 13.5H13.875C15.7365 13.5 17.25 15.0135 17.25 16.875C17.25 17.082 17.082 17.25 16.875 17.25H7.125C6.918 17.25 6.75 17.082 6.75 16.875Z"
      fill="#00645A"
    />
  </svg>
);
