'use client';
import React, { FC } from 'react';
import TimeIcon from '@/app/_icons/TimeIcon';
import CheckMarkIcon from '@/app/_icons/CheckMarkIcon';
import StarIconSmall from '@/app/_icons/StarIconSmall';
import Image from 'next/image';
import { Experience } from '@/app/_interfaces/experience.interface';
import { styles } from './styles';
import { DollarIcon } from '@/app/_icons/DollarIcon';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { formatPrice } from '@/app/_helpers/formatPrice';

type ExperienceCardProps = Experience & {
  full?: boolean;
};

const ExperienceCard: FC<ExperienceCardProps> = ({
  imageSrc,
  title,
  rating,
  reviews,
  duration,
  cancellationPolicy,
  price,
  originalPrice,
  full = false,
}) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const format = useFormatter();
  const { currency } = getUserInfo();

  const isDiscounted = !!originalPrice && originalPrice !== price;

  return (
    <div className={`mr-6 ${full ? 'w-full' : 'w-[288px]'} flex-shrink-0 snap-start`}>
      <div className={styles.card}>
        <Image
          draggable="false"
          width={288}
          height={216}
          src={imageSrc}
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', width: '100%' }}
        />
        <div className={styles.grid}>
          <div className={styles.rating}>
            {rating && (
              <>
                <StarIconSmall className={styles.icon} />
                <b>{rating?.toFixed(1)}</b>
                <p className={styles.reviews}>({reviews?.toLocaleString(locale)})</p>
              </>
            )}
          </div>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.detailsContainer}>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <TimeIcon className={styles.icon} />
                <p>{duration}</p>
              </div>
              <div className={styles.detailItem}>
                {cancellationPolicy && (
                  <>
                    <CheckMarkIcon className={styles.icon} />
                    <p>{cancellationPolicy}</p>
                  </>
                )}
              </div>
              <div className={styles.detailItem}>
                <DollarIcon className={styles.icon} />
                <p className={styles.priceLabel}>{t('from')}</p>
                <div className={styles.priceContainer}>
                  {isDiscounted ? (
                    <>
                      <div className={styles.originalPrice}>
                        {formatPrice({
                          currency,
                          price: Number(originalPrice) || 0,
                          format,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className={styles.discountPrice}>
                        {formatPrice({
                          currency,
                          price: Number(price) || 0,
                          format,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </>
                  ) : (
                    <div className={styles.price}>
                      {formatPrice({
                        currency,
                        price: Number(price) || 0,
                        format,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
