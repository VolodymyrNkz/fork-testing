import { useParams } from 'next/navigation';
import { GetSupplierBody, GetSupplierResponse } from '@/app/api/getSupplier/types';
import { useCallback, useEffect, useState } from 'react';
import { styles } from '@/app/_components/TourOperatorInformation/styles';
import { useTranslations } from 'next-intl';
import { useRequest } from '@/app/_hooks/useRequest';

interface OperationStructuredData {
  'Trading name'?: string;
  'Operator name'?: string;
  Address?: string;
  Phone?: string;
  Email?: string;
  'Registered in'?: string;
}

type OperatorType = 'business' | 'individual' | 'legal';

export const TourOperatorInformation = () => {
  const t = useTranslations('tourOperator');
  const createRequest = useRequest();

  const { id: productId } = useParams<{ id: string }>();

  const [operatorInfo, setOperatorInfo] = useState<OperationStructuredData>();
  const [operatorType, setOperatorType] = useState<OperatorType>();

  const getSupplierContactInfo = useCallback(async () => {
    const data = await createRequest<GetSupplierResponse, GetSupplierBody>({
      endpoint: 'getSupplier',
      body: {
        productCodes: [productId],
      },
    });

    const supplier = data.suppliers[0];
    const supplierType = supplier.type;
    const isSupplierLegal = supplier.supplierAgreedToLegalCompliance;
    const structuredData: OperationStructuredData = {
      ...(supplier.type === 'BUSINESS'
        ? supplier.tradeRegisterName || supplier.name
          ? { [t('tradingName')]: supplier.tradeRegisterName || supplier.name }
          : {}
        : supplier.name
          ? { [t('operatorName')]: supplier.name }
          : {}),
      ...(supplier.contact?.address && { Address: supplier.contact.address }),
      ...(supplier.contact?.phone && { Phone: supplier.contact.phone }),
      ...(supplier.contact?.email && { Email: supplier.contact.email }),
      ...(supplier.registrationCountry && { [t('registeredIn')]: supplier.registrationCountry }),
    };

    setOperatorInfo(structuredData);
    setOperatorType(isSupplierLegal ? 'legal' : (supplierType.toLowerCase() as OperatorType));
  }, [productId]);

  useEffect(() => {
    getSupplierContactInfo();
  }, [getSupplierContactInfo]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>{t('information')}</div>
      {operatorInfo && (
        <div className={styles.list}>
          {Object.entries(operatorInfo).map(([key, value]) => (
            <div key={key} className={styles.infoRow}>
              <b className={styles.infoKey}>{key}:</b>
              <span className={styles.infoValue}>{value || 'N/A'}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.supplierType}>
        {operatorType === 'legal' ? (
          <div>
            {t.rich('legal', {
              br: () => <br />,
            })}
          </div>
        ) : operatorType === 'business' ? (
          <div>{t('business')}</div>
        ) : (
          <div>
            {t.rich('individual', {
              br: () => <br />,
            })}
          </div>
        )}
      </div>
    </div>
  );
};
