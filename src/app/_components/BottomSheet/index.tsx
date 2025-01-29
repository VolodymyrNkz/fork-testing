import { FC, ReactNode, useRef } from 'react';
import { CrossIcon } from '@/app/_icons/CrossIcon';
import useSwipeToClose from '@/app/_components/BottomSheet/service';
import { styles } from '@/app/_components/BottomSheet/styles';

interface BottomSheetProps {
  isOpen: boolean;
  toggle: () => void;
  children: ReactNode;
  title?: string;
  triggerComponent?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  divideHeader?: boolean;
  backButton?: ReactNode;
  borderBottom?: boolean;
  fullHeight?: boolean;
}

export const BottomSheet: FC<BottomSheetProps> = ({
  title,
  isOpen,
  toggle,
  triggerComponent,
  children,
  footer,
  header,
  divideHeader,
  backButton,
  fullHeight,
  borderBottom,
}) => {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const headerDividerRef = useRef<HTMLDivElement | null>(null);

  const { handleTouchStart, handleTouchMove } = useSwipeToClose(toggle);

  return (
    <>
      <div onClick={toggle}>{triggerComponent}</div>
      <div
        className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}
        onClick={toggle}
      >
        <div
          className={`${styles.sheet} ${fullHeight ? 'h-[100dvh]' : ''} ${isOpen ? styles.sheetOpen : styles.sheetClosed}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            <div className={styles.grabber}></div>
            <div className={`${styles.header} ${borderBottom ? styles.borderBottom : ''}`}>
              {backButton}
              <h2 className={styles.title}>{title}</h2>
              <CrossIcon onClick={toggle} />
            </div>
            {header && (
              <div
                ref={headerDividerRef}
                className={`${divideHeader ? styles.headerDividerHorizontal : styles.headerDivider}`}
              >
                {header}
              </div>
            )}
          </div>
          <div className={styles.content}>{children}</div>
          {footer && (
            <div
              ref={footerRef}
              className={`${fullHeight ? 'absolute bottom-0' : ''} ${styles.footer}`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
