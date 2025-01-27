'use client';

import React, { useEffect, useState } from 'react';
import { styles } from '@/app/_components/FullScreenPanel/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

interface FullScreenPanelProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  closeTrigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  toggle?: () => void;
  footer?: React.ReactNode;
  closeButton?: boolean;
}

export const FullScreenPanel: React.FC<FullScreenPanelProps> = ({
  trigger,
  children,
  onClose,
  closeTrigger,
  title,
  isOpen,
  footer,
  closeButton = true,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(isOpen);

  const handleOpen = () => setIsPanelOpen(true);
  const handleClose = () => {
    setIsPanelOpen(false);
    onClose?.();
  };

  useEffect(() => {
    setIsPanelOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isPanelOpen === undefined) {
      return;
    }

    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPanelOpen]);

  return (
    <>
      {trigger && (
        <div onClick={handleOpen} className={styles.trigger}>
          {trigger}
        </div>
      )}
      <div className={`${styles.panel} ${isPanelOpen ? styles.panelOpen : styles.panelClosed}`}>
        {title ? (
          <div className={styles.header} onClick={handleClose}>
            <ArrowIcon className={styles.icon} />
            <div className={styles.title}>{title}</div>
          </div>
        ) : closeButton ? (
          <div className={styles.closeButton} onClick={handleClose}>
            {closeTrigger || (
              <button aria-label="Close">
                <CloseIcon />
              </button>
            )}
          </div>
        ) : undefined}
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>
  );
};
