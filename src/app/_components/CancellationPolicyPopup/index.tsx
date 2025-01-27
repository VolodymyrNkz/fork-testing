import {
  CancellationType,
  RefundEligibility,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { FC } from 'react';
import { styles } from '@/app/_components/CancellationPolicyPopup/styles';
import { useTranslations } from 'next-intl';

interface CancellationPolicyPopupProps {
  refundEligibility: RefundEligibility[];
  cancellationType?: CancellationType;
  cancelIfBadWeather?: boolean;
  cancelIfInsufficientTravelers?: boolean;
}

export const CancellationPolicyPopup: FC<CancellationPolicyPopupProps> = ({
  refundEligibility,
  cancellationType,
  cancelIfBadWeather = false,
  cancelIfInsufficientTravelers = false,
}) => {
  const t = useTranslations('cancellationPolicy');

  const renderStandardPolicy = () => (
    <>
      <div className={styles.summary}>{t('standard.summary')}</div>
      <ul className={styles.list}>
        {t.rich('standard.list', {
          li: (chunks) => <li>{chunks}</li>,
        })}
      </ul>
    </>
  );

  const renderCustomPolicy = () => {
    if (!refundEligibility || refundEligibility.length === 0) {
      return null;
    }

    const fullRefundPolicy = refundEligibility.find((item) => item.percentageRefundable === 100);
    const partialRefundPolicy = refundEligibility.find(
      (item) => item.percentageRefundable < 100 && item.percentageRefundable > 0,
    );
    const noRefundPolicy = refundEligibility.find((item) => item.percentageRefundable === 0);

    return (
      <>
        {fullRefundPolicy && (
          <div className={styles.summary}>
            {t('custom.summary', { count: fullRefundPolicy.dayRangeMin })}
          </div>
        )}
        <ul className={styles.list}>
          {fullRefundPolicy && (
            <li>{t('custom.fullRefund', { count: fullRefundPolicy.dayRangeMin })}</li>
          )}
          {partialRefundPolicy && (
            <li>
              {t('custom.partialRefund', {
                percent: partialRefundPolicy.percentageRefundable,
                from: partialRefundPolicy.dayRangeMin,
                to: partialRefundPolicy.dayRangeMax,
              })}
            </li>
          )}
          {noRefundPolicy && (
            <li>{t('custom.noRefundFirst', { count: noRefundPolicy.dayRangeMax })}</li>
          )}
          {noRefundPolicy && (
            <li>{t('custom.noRefundSecond', { count: noRefundPolicy.dayRangeMax })}</li>
          )}
          <li>{t('custom.cutOff')}</li>
        </ul>
      </>
    );
  };

  const renderSalesFinalPolicy = () => <div className={styles.summary}>{t('salesFinal')}</div>;

  const renderAdditionalPolicies = () => (
    <ul className={styles.list}>
      {cancelIfBadWeather && <li>{t('badWeather')}</li>}
      {cancelIfInsufficientTravelers && <li>{t('insufficientTravelers')}</li>}
    </ul>
  );

  const renderPolicy = () => {
    switch (cancellationType) {
      case 'STANDARD':
        return renderStandardPolicy();
      case 'CUSTOM':
        return renderCustomPolicy();
      case 'ALL_SALES_FINAL':
        return renderSalesFinalPolicy();
      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>{t('title')}</div>
      {renderPolicy()}
      {renderAdditionalPolicies()}
    </div>
  );
};
