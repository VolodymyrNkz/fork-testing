'use client';
import { useState, ReactNode, Children, useRef, useEffect } from 'react';
import { styles } from '@/app/_components/Accordion/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { useTranslations } from 'next-intl';

interface AccordionProps {
  children: ReactNode;
  maxItems?: number;
  className?: string;
  noPadding?: boolean;
}

export const Accordion = ({ children, maxItems, noPadding = false }: AccordionProps) => {
  const t = useTranslations('buttons');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => setIsExpanded(!isExpanded);

  const childArray = Children.toArray(children);

  const visibleChildren = isExpanded
    ? childArray
    : maxItems
      ? childArray.slice(0, maxItems)
      : childArray;

  useEffect(() => {
    if (!maxItems && contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [children, maxItems]);

  const shouldShowButton = isTruncated || (maxItems && childArray.length > maxItems);

  return (
    <div
      className={`${noPadding ? 'rounded-none border-none px-0 py-0' : ''} ${!isTruncated && maxItems ? 'p-0' : ''}${styles.root}`}
    >
      <div className={`${styles.accordionWrapper} ${isExpanded ? styles.opened : ''}`}>
        {maxItems ? (
          visibleChildren.map((child, index) => (
            <div key={index} className={styles.content}>
              {child}
            </div>
          ))
        ) : (
          <div
            ref={contentRef}
            className={`${styles.content} ${!isExpanded ? styles.truncated : ''}`}
          >
            {children}
          </div>
        )}
      </div>
      {shouldShowButton && (
        <div className={`${!isTruncated ? 'border-none p-md' : ''} ${styles.buttonSection}`}>
          <div onClick={toggleAccordion} className={styles.button}>
            {isExpanded ? t('seeLess') : t('seeMore')}
            <ArrowIcon className={`${isExpanded ? styles.iconActive : styles.icon}`} />
          </div>
        </div>
      )}
    </div>
  );
};
