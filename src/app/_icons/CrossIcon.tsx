import { IconProps } from '@/app/_icons/types';
import { FC } from 'react';

export const CrossIcon: FC<IconProps> = ({ className, ...props }) => (
  <svg
    {...props}
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.04936 6.05025C6.43988 5.65973 7.07305 5.65973 7.46357 6.05025L11.9991 10.5858L16.5346 6.05025C16.9252 5.65973 17.5583 5.65973 17.9489 6.05025C18.3394 6.44078 18.3394 7.07394 17.9489 7.46447L13.4133 12L17.9489 16.5355C18.3394 16.9261 18.3394 17.5592 17.9489 17.9497C17.5583 18.3403 16.9252 18.3403 16.5346 17.9497L11.9991 13.4142L7.46357 17.9497C7.07305 18.3403 6.43988 18.3403 6.04936 17.9497C5.65883 17.5592 5.65883 16.9261 6.04936 16.5355L10.5849 12L6.04936 7.46447C5.65883 7.07394 5.65883 6.44078 6.04936 6.05025Z"
    />
  </svg>
);
