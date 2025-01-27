import { FC } from 'react';
import TicketIcon from '@/app/_icons/TicketIcon';
import { styles } from './styles';
import { ProviderReferenceLink } from '../LocationPoint';
import { LocationBulkResponse } from '@/app/_interfaces/product-response.interface';
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
  points: LocationBulkResponse[];
}

export const RedemptionPoints: FC<Props> = ({ title, points }) => {
  const t = useTranslations('productPage');

  return (
    <div className={styles.listItem}>
      <TicketIcon className={styles.iconWrapper} />
      <div>
        <div className={styles.listItemTitle}>{title}</div>
        <ul className="flex flex-col gap-2">
          {points.map((point, index) => (
            <li key={index} className={styles.listItemText}>
              <>
                {point.name || (
                  <div className="flex flex-col">
                    {`${t('ticketPointDefaultName')} ${index + 1}`}
                    <ProviderReferenceLink location={point} className="text-primary" />
                  </div>
                )}
                {!!point.address &&
                  `, ${[
                    point.address.street,
                    point.address.administrativeArea || point.address.state,
                    point.address.postcode,
                    point.address.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}`}
              </>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
