'use client';
import { useState, ReactNode, Children, useRef, isValidElement } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/_components/StepAccordion/styles';
import { useTranslations } from 'next-intl';

interface AccordionProps {
  children: ReactNode;
  maxItems?: number;
  withoutContainer?: boolean;
}

export const StepAccordion = ({ children, maxItems, withoutContainer = false }: AccordionProps) => {
  const t = useTranslations('buttons');
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => setIsExpanded(!isExpanded);

  const childArray = Children.toArray(children);
  const isOneChild = childArray.length === 1;

  const visibleChildren = isExpanded
    ? childArray
    : maxItems
      ? childArray.slice(0, maxItems)
      : childArray;

  const shouldShowButton = maxItems && childArray.length > maxItems;

  return (
    <div className={`${withoutContainer ? styles.rootWithoutBorder : styles.root}`}>
      <div className={`${styles.accordionWrapper} ${isExpanded ? styles.opened : ''}`}>
        {maxItems ? (
          visibleChildren.map((child, index) => {
            return isValidElement(child) ? (
              <div
                key={index}
                className={`${isOneChild ? 'ml-0' : child.props.passByWithoutStopping ? styles.contentPassBy : ''} ${styles.content}`}
              >
                {!isOneChild && (
                  <div className={styles.dotWrapper}>
                    <span
                      className={`${styles.dot} ${
                        child.props.passByWithoutStopping ? styles.dotPassBy : styles.dotStop
                      }`}
                    >
                      {!child.props.passByWithoutStopping && child.props.index + 1}
                    </span>
                    {index < visibleChildren.length - 1 && <div className={styles.line} />}
                  </div>
                )}
                {child}
              </div>
            ) : null;
          })
        ) : (
          <div
            ref={contentRef}
            className={`${styles.content} ${!isExpanded ? styles.truncated : ''}`}
          >
            {Children.map(childArray, (child, index) =>
              isValidElement(child) ? (
                <div
                  className={`${child.props.passByWithoutStopping ? styles.contentPassBy : ''} ${styles.content}`}
                  key={index}
                >
                  {!isOneChild && (
                    <div className={styles.dotWrapper}>
                      <span className={styles.index}>{index + 1}. </span>
                      {index < childArray.length - 1 && <div className={styles.line} />}
                    </div>
                  )}
                  {child}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
      {shouldShowButton && (
        <div className={`${styles.buttonSection}`}>
          <div onClick={toggleAccordion} className={styles.button}>
            {isExpanded ? t('seeLess') : t('seeSteps', { count: childArray.length - 2 })}
            <ArrowIcon className={`${isExpanded ? styles.iconActive : styles.icon}`} />
          </div>
        </div>
      )}
    </div>
  );
};
