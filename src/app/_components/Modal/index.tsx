'use client';
import React, { FC, ReactNode, useEffect } from 'react';
import { styles } from '@/app/_components/Modal/styles';
import { CrossIcon } from '@/app/_icons/CrossIcon';
import { useTranslations } from 'next-intl';
import { ModalMessages, ModalReason } from '@/app/_contexts/modalContext';
import { GTM_IDS } from '@/app/_constants/gtm';

interface ModalProps {
  reason: ModalReason;
  button: ReactNode;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = ({ reason, button, onClose }) => {
  const t = useTranslations('modals');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContainer}
        id={reason === 'notBookable' ? GTM_IDS.notSupportedEvent : reason}
      >
        {reason === 'somethingWentWrong' && (
          <CrossIcon className={styles.modalClose} onClick={onClose} aria-label="Close" />
        )}
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            {t.rich(ModalMessages[reason].title, {
              br: () => <br />,
            })}
          </h2>
          <div className={styles.modalText}>
            {t.rich(ModalMessages[reason].text, {
              br: () => <br />,
              div: (chunks) => <div>{chunks}</div>,
            })}
          </div>
          {button}
        </div>
      </div>
    </div>
  );
};
