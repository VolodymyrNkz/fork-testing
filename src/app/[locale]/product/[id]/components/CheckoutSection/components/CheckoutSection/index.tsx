'use client';
import { BottomSheet } from '@/app/_components/BottomSheet';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useBooking } from '@/app/_contexts/bookingContext';
import { Header } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/Header';
import { ContactDetails } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/ContactDetails';
import { CommonButton } from '@/app/_components/CommonButton';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/CheckoutSection/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { OrderSummary } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/OrderSummary';
import { useTranslations } from 'next-intl';
import {
  CancellationType,
  StartEndPoint,
  TravelerPickup,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { ActivityDetails } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/ActivityDetails';
import { RefundEligibility } from '@/app/_interfaces/product-response.interface';
import { PaymentSection } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/PaymentSection';
import { useRouter, useSearchParams } from 'next/navigation';
import { MappedLanguageGuides } from '@/app/[locale]/product/[id]/service';
import { useModal } from '@/app/_contexts/modalContext';
import { GTM_EVENTS } from '@/app/_constants/gtm';

export interface CancellationStatus {
  cancellationType?: CancellationType;
  refundEligibility?: RefundEligibility[];
  cancelIfBadWeather?: boolean;
  cancelIfInsufficientTravelers?: boolean;
}

interface CheckoutBottomSheet {
  title?: string;
  bookingQuestions: string[];
  travelerPickup?: TravelerPickup;
  languageGuides?: MappedLanguageGuides;
  startPoint?: StartEndPoint[];
  cancellationStatus: CancellationStatus;
  tags: number[];
}

export type Steps = Record<number, boolean>;

export const CheckoutBottomSheet: FC<CheckoutBottomSheet> = ({
  title,
  travelerPickup,
  bookingQuestions,
  languageGuides,
  startPoint,
  cancellationStatus,
  tags,
}) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    productBookingData,
    proceedBooking,
    sessionExpiresAt,
    holdLoading,
    setPartnerRef,
    availabilityChanged,
    bookingQuestionsFormHandler,
    contactDetailsFormHandler,
    handleSubmitPayment,
    handleSetProductTitle,
    shouldCloseCheckout,
    setShouldCloseCheckout,
    handleSetProductTags,
  } = useBooking();

  const { openModal, closeModal } = useModal();

  const [currentStep, setCurrentStep] = useState(0);
  const [isCheckoutSectionOpen, setIsCheckoutSectionOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Steps>({
    0: false,
    1: false,
    2: false,
  });
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleToggleModal = () => {
    setIsCheckoutSectionOpen((prev) => !prev);
  };

  const handleSetCurrentStep = (step: number) => {
    if (completedSteps[step - 1 === 0 ? step - 1 : step]) {
      setCurrentStep(step);
    }
  };

  const handleToggleSummary = () => {
    setIsSummaryOpen((prev) => !prev);
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      contactDetailsFormHandler.touchAllFields();

      if (contactDetailsFormHandler.isAllFieldsValid()) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    if (currentStep === 1) {
      bookingQuestionsFormHandler.touchAllFields();
      bookingQuestionsFormHandler.isAllFieldsValid();
      if (bookingQuestionsFormHandler.isAllFieldsValid()) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    if (currentStep === 2) {
      handleSubmitPayment();
      setCompletedSteps({
        0: false,
        1: false,
        2: false,
      });
    }
  };

  const handleContinueCheckout = useCallback(async () => {
    if (productBookingData) {
      if (holdLoading) {
        return;
      }
      await proceedBooking(productBookingData);
      setSessionExpired(false);
    }
  }, [holdLoading, proceedBooking, productBookingData]);

  useEffect(() => {
    if (searchParams.get('wizardStep')) {
      setCurrentStep(Number(searchParams.get('wizardStep')));
      setIsCheckoutSectionOpen(true);

      const params = new URLSearchParams(searchParams.toString());
      params.delete('wizardStep');
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isCheckoutSectionOpen && currentStep !== 0) {
      setCurrentStep(0);
    }
    if (typeof window !== 'undefined' && isCheckoutSectionOpen) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: Object.values(GTM_EVENTS)[currentStep],
      });
    }
  }, [currentStep, isCheckoutSectionOpen]);

  useEffect(() => {
    if (productBookingData) {
      setIsCheckoutSectionOpen(true);
    }
  }, [productBookingData]);

  useEffect(() => {
    setCompletedSteps((prev) => ({ ...prev, 0: contactDetailsFormHandler.isAllFieldsValid() }));
  }, [contactDetailsFormHandler.isAllFieldsValid]);

  useEffect(() => {
    if (sessionExpiresAt) {
      const now = new Date();
      const timeUntilExpiration = sessionExpiresAt - now.getTime();

      const timer = setTimeout(() => {
        setSessionExpired(true);
        setPartnerRef(null);
      }, timeUntilExpiration);

      return () => clearTimeout(timer);
    }
  }, [sessionExpiresAt, setPartnerRef]);

  useEffect(() => {
    if (title) {
      handleSetProductTitle(title);
    }
  }, [title, handleSetProductTitle]);

  useEffect(() => {
    if (availabilityChanged) {
      setIsCheckoutSectionOpen(false);
    }
  }, [availabilityChanged]);

  useEffect(() => {
    if (sessionExpired) {
      openModal('sessionExpired', handleContinueCheckout);
    } else {
      closeModal();
    }
  }, [sessionExpired]);

  useEffect(() => {
    if (shouldCloseCheckout) {
      setIsCheckoutSectionOpen(false);
      setShouldCloseCheckout(false);
    }
  }, [shouldCloseCheckout]);

  useEffect(() => {
    handleSetProductTags(tags);
  }, [handleSetProductTags, tags]);

  const steps = [
    {
      title: t('checkout.contactDetails'),
      content: <ContactDetails />,
    },
    {
      title: t('checkout.activityDetails'),
      content: (
        <ActivityDetails
          cancellationStatus={cancellationStatus}
          startPoint={startPoint}
          languageGuides={languageGuides}
          travelerPickup={travelerPickup}
          title={title}
          email={contactDetailsFormHandler.formState.email.value || ''}
          bookingQuestionsIds={bookingQuestions}
        />
      ),
    },
    {
      title: t('checkout.paymentDetails'),
      content: <PaymentSection />,
    },
  ];

  return (
    <>
      <BottomSheet
        backButton={
          currentStep ? (
            <ArrowIcon
              className={styles.arrow}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            />
          ) : undefined
        }
        title={title}
        footer={
          <CommonButton
            full
            label={currentStep === 2 ? t('buttons.bookNow') : t('buttons.next')}
            onClick={handleNextStep}
          />
        }
        header={
          <Header
            openSummary={handleToggleSummary}
            setCurrentStep={handleSetCurrentStep}
            currentStep={currentStep}
          />
        }
        fullHeight
        isOpen={isCheckoutSectionOpen}
        toggle={handleToggleModal}
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>{steps[currentStep].title}</div>
          {steps[currentStep].content}
        </div>
      </BottomSheet>
      <FullScreenPanel
        footer={
          <CommonButton
            full
            onClick={handleToggleSummary}
            label={t('buttons.continueToCheckout')}
          />
        }
        onClose={handleToggleSummary}
        isOpen={isSummaryOpen}
      >
        <OrderSummary
          cancellationStatus={cancellationStatus}
          email={!!currentStep ? contactDetailsFormHandler.formState.email.value : ''}
          title={title}
        />
      </FullScreenPanel>
    </>
  );
};
