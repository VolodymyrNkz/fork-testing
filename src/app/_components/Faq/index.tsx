import { FC } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/_components/Faq/styles';
import { useTranslations } from 'next-intl';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  className?: string;
}

const FAQ: FC<FAQProps> = ({ items, className }) => {
  const t = useTranslations('faq');

  return (
    <div className={`${className || ''} ${styles.container}`}>
      <h2 className={styles.heading}>{t('title')}</h2>
      <div className={styles.list}>
        {items.map((item, index) => (
          <details key={index} className={`${styles.item} group`}>
            <summary className={styles.summary}>
              <span>{t(item.question)}</span>
              <ArrowIcon className={`${styles.icon} group-open:-rotate-90`} />
            </summary>
            <div className={`${styles.answer} group-open:mt-md`}>
              <p>{t(item.answer)}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
