'use client';
import { usePathname } from 'next/navigation';
import { LanguageSelect } from '@/app/[locale]/components/LanguageSelect';
import { styles } from '@/app/[locale]/components/Footer/styles';
import { CurrencySelect } from '@/app/[locale]/components/CurrencySelect';

export const Footer = () => {
  const pathname = usePathname();

  const isProductPage = pathname.includes('/product/');

  return (
    <div
      className={styles.root}
      style={{
        marginBottom: isProductPage ? '80px' : '0',
      }}
    >
      <LanguageSelect />
      <CurrencySelect />
    </div>
  );
};
