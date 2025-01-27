'use client';
import React, { useEffect, useMemo } from 'react';
import { useBooking } from '@/app/_contexts/bookingContext';
import { CustomInput } from '@/app/_components/CustomInput';
import { SelectInput } from '@/app/_components/SelectInput';
import countryList from 'react-select-country-list';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/PaymentSection/styles';
import { PaymentIcon } from '@/app/_icons/PaymentIcon';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Skeleton from '@/app/_components/Skeleton';

const VIATOR_TERMS_LINK = 'https://www.viator.com/support/termsAndConditions';
const VIATOR_PRIVACY_POLICY_LINK = 'https://www.viator.com/support/privacyPolicy';

export const PaymentSection = () => {
  const t = useTranslations('checkout');
  const { sessionToken, initializePayment, paymentFormHandler, payment } = useBooking();
  const { updateField, isFieldValid, formValues, formState } = paymentFormHandler;
  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    if (sessionToken) {
      initializePayment(sessionToken);
    }
  }, [sessionToken, initializePayment]);

  return (
    <div>
      <div className={styles.title}>{t('payWith')}</div>
      <div className={styles.cardSection}>
        <div className={styles.iconWrapper}>
          <PaymentIcon className={styles.cardIcon} />
        </div>
        <div>{t('creditCard')}</div>
      </div>
      {!payment && (
        <>
          {new Array(3).fill(null).map((_, index) => (
            <div key={index}>
              <Skeleton mb={10} width="30%" />
              <Skeleton mb={20} />
            </div>
          ))}
        </>
      )}
      <div id="card-frame-holder-module"></div>
      <div className={styles.inputSection}>
        <SelectInput
          required
          invalid={!isFieldValid('country') && formState.country.touched}
          placeholder={t('country')}
          options={options}
          onSelect={(value) => updateField('country', value)}
          defaultValue={formValues.country}
        />
        <CustomInput
          name="zip"
          required
          invalid={!isFieldValid('postalCode') && formState.postalCode.touched}
          onChange={(value) => updateField('postalCode', value)}
          placeholder={t('zipCode')}
          value={formValues.postalCode}
        />
      </div>
      <div className={styles.agreementSection}>
        {t.rich('agreementText', {
          terms: (chunks) => (
            <Link className={styles.link} href={VIATOR_TERMS_LINK} target="_blank">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link className={styles.link} href={VIATOR_PRIVACY_POLICY_LINK} target="_blank">
              {chunks}
            </Link>
          ),
          listing: (chunks) => (
            <Link className={styles.link} href={window.location.href} target="_blank">
              {chunks}
            </Link>
          ),
        })}
      </div>
    </div>
  );
};
