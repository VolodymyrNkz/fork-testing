import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/ContactDetails/styles';
import { CustomInput } from '@/app/_components/CustomInput';
import 'react-phone-number-input/style.css';
import { CountryPhoneCodeSelect } from '@/app/_components/CountryPhoneCodeSelect';
import { useTranslations } from 'next-intl';
import { useBooking } from '@/app/_contexts/bookingContext';

export const ContactDetails = () => {
  const t = useTranslations();

  const { contactDetailsFormHandler } = useBooking();
  const { formState, isFieldValid, updateField } = contactDetailsFormHandler;

  return (
    <>
      <div className={styles.text}>{t('checkout.informationUse')}</div>
      <div className={styles.inputSection}>
        <CustomInput
          invalid={!isFieldValid('firstName') && formState.firstName.touched}
          value={formState.firstName.value}
          required
          placeholder={t('inputs.firstName')}
          onChange={(value) => updateField('firstName', value)}
          name="firstName"
        />
        <CustomInput
          invalid={!isFieldValid('lastName') && formState.lastName.touched}
          value={formState.lastName.value}
          required
          placeholder={t('inputs.lastName')}
          onChange={(value) => updateField('lastName', value)}
          name="lastName"
        />
        <CustomInput
          required
          invalid={!isFieldValid('email') && formState.email.touched}
          value={formState.email.value}
          placeholder={t('inputs.email')}
          onChange={(value) => updateField('email', value)}
          name="email"
          type="email"
          helperText={{
            text: t('checkout.emailWarning'),
            mode: 'warning',
          }}
        />
        <div className={styles.inputRow}>
          <div className={styles.countryPhoneCode}>
            <CountryPhoneCodeSelect
              value={formState.countryCode.value}
              onSelect={(value) => updateField('countryCode', value)}
            />
          </div>
          <div className={styles.customInput}>
            <CustomInput
              required
              invalid={!isFieldValid('phone') && formState.phone.touched}
              value={formState.phone.value}
              placeholder={t('inputs.phone')}
              onChange={(value) => updateField('phone', value)}
              name="phone"
              type="number"
            />
          </div>
        </div>
      </div>
    </>
  );
};
