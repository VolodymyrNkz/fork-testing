'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Modal } from '@/app/_components/Modal';
import { scroller } from 'react-scroll';
import { CommonButton } from '@/app/_components/CommonButton';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import { useRouter, useSearchParams } from 'next/navigation';

interface ModalContextProps {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (reason: ModalReason, callback?: () => void) => void;
  setReason: (reason: ModalReason) => void;
  closeModal: () => void;
}

export type ModalReason = keyof typeof ModalMessages;

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalMessages = {
  sessionExpired: {
    title: 'sessionExpired',
    text: 'sessionExpiredText',
    button: 'continueCheckout',
  },
  availabilityChanged: {
    title: 'availabilityChanged',
    text: 'availabilityChangedText',
    button: 'changeDate',
  },
  somethingWentWrong: {
    title: 'somethingWentWrong',
    text: 'somethingWentWrongText',
    button: 'reload',
  },
  notBookable: {
    title: 'notBookable',
    text: 'notBookableText',
    button: 'exploreOther',
  },
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const t = useTranslations('buttons');
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [reason, setReason] = useState<ModalReason | null>(null);
  const [callback, setCallback] = useState<(() => void) | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const openModal = useCallback((reason: ModalReason, callback?: () => void) => {
    setReason(reason);
    if (callback) {
      setCallback(() => callback);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  const modalButtonHandler = () => {
    setIsOpen(false);
    if (callback) {
      callback();
    }

    if (reason === 'somethingWentWrong') {
      window.location.reload();
    } else if (reason === 'availabilityChanged') {
      scroller.scrollTo('availabilityControls', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -400,
      });
    } else if (reason === 'notBookable') {
      router.back();
    }
  };

  const modalCloseHandler = () => {
    if (pathname === NAVIGATION_ROUTES.home) {
      router.refresh();
    } else if (pathname.includes(NAVIGATION_ROUTES.results)) {
      router.push(NAVIGATION_ROUTES.home);
    } else if (pathname.includes(NAVIGATION_ROUTES.product)) {
      if (params.get('checkoutSection') && callback) {
        callback();
      } else {
        router.back();
      }
    }
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal, setReason }}>
      {children}
      {isOpen && reason && (
        <Modal
          onClose={modalCloseHandler}
          reason={reason}
          button={
            <CommonButton
              full
              label={t(ModalMessages[reason].button)}
              onClick={() => modalButtonHandler()}
            />
          }
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
