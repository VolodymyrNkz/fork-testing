'use client';
import { FC } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/_components/NavBackButton/styles';
import { useRouter } from '@/i18n/routing';

interface NavBackButtonProps {
  title: string;
}

export const NavBackButton: FC<NavBackButtonProps> = ({ title }) => {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <div className={styles.root}>
      <ArrowIcon className={styles.arrowIcon} onClick={onClick} />
      <span className={styles.title}>{title}</span>
    </div>
  );
};
