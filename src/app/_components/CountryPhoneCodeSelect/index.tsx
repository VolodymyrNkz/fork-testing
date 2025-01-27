import { getCountries } from 'react-phone-number-input/input';
import { getCountryCallingCode } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en';
import frLabels from 'react-phone-number-input/locale/fr';
import itLabels from 'react-phone-number-input/locale/it';
import esLabels from 'react-phone-number-input/locale/es';
import { FC, useMemo } from 'react';
import { CountryCode } from 'libphonenumber-js';
import { useLocale } from 'next-intl';
import { DEFAULT_COUNTRY_CODE } from '@/app/_constants/common';
import { SelectInput } from '@/app/_components/SelectInput';

interface CountryPhoneCodeSelectProps {
  onSelect: (countryCode: string) => void;
  value: string;
}

const labels = {
  en: enLabels,
  fr: frLabels,
  it: itLabels,
  es: esLabels,
};

export const CountryPhoneCodeSelect: FC<CountryPhoneCodeSelectProps> = ({ onSelect, value }) => {
  const locale = useLocale();

  const options = useMemo(() => {
    const countryLabels = labels[locale as keyof typeof labels] || labels.en;
    return getCountries().map((country) => ({
      value: country,
      label: `+(${getCountryCallingCode(country)}) ${countryLabels[country]}`,
    }));
  }, [locale]);

  return (
    <SelectInput
      listWidth="300px"
      itemClassName="min-w-[300px]"
      position="above"
      options={options}
      onSelect={(value: CountryCode) => onSelect(value)}
      defaultValue={options.find((item) => item.value === value)?.value || DEFAULT_COUNTRY_CODE}
      renderValue={(option) => <span>{option.label}</span>}
    />
  );
};
