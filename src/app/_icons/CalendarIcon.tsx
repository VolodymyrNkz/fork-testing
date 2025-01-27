import { FC } from 'react';
import { IconProps } from '@/app/_icons/types';

export const CalendarIcon: FC<IconProps> = ({ className, color }) => {
  const iconColor = color ? color : '#020F19';

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 1C15.5523 1 16 1.44772 16 2V6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6V5H10.5C9.94772 5 9.5 4.55228 9.5 4C9.5 3.44772 9.94772 3 10.5 3H14V2C14 1.44772 14.4477 1 15 1ZM2 10C2 9.44772 2.44772 9 3 9H21C21.5523 9 22 9.44772 22 10V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V10ZM4 11V19C4 19.5523 4.44771 20 5 20H19C19.5523 20 20 19.5523 20 19V11H4Z"
        fill={iconColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 5C4.44771 5 4 5.44771 4 6V10C4 10.5523 3.55228 11 3 11C2.44772 11 2 10.5523 2 10V6C2 4.34315 3.34315 3 5 3H7C7.55228 3 8 3.44772 8 4C8 4.55228 7.55228 5 7 5H5Z"
        fill={iconColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1C7.55228 1 8 1.44772 8 2V6C8 6.55228 7.55228 7 7 7C6.44772 7 6 6.55228 6 6V2C6 1.44772 6.44772 1 7 1Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 4C17.5 3.44772 17.9477 3 18.5 3H19C20.6569 3 22 4.34315 22 6V10C22 10.5523 21.5523 11 21 11C20.4477 11 20 10.5523 20 10V6C20 5.44771 19.5523 5 19 5H18.5C17.9477 5 17.5 4.55228 17.5 4Z"
        fill={iconColor}
      />
    </svg>
  );
};
