'use client';
import React from 'react';
import Image from 'next/image';
import { Chip } from '@/app/_components/Chip';
import { styles } from '@/app/_components/ImageGallery/styles';
import { FilterValues, useImageViewer } from '@/app/_contexts/imageViewerContext';
import { useTranslations } from 'next-intl';

const galleryFilters = (total: number, provider: number, guests: number, t: any) =>
  [
    {
      label: t('filterPanel.all', { count: total }),
      value: null,
    },
    {
      label: t('filterPanel.byProvider', { count: provider }),
      value: 'provider',
    },
    ...(guests > 0
      ? [
          {
            label: t('filterPanel.byGuests', { count: guests }),
            value: 'guests',
          },
        ]
      : []),
  ] as const;

export const ImageGallery = () => {
  const t = useTranslations();
  const {
    openModal,
    providerPhotos = [],
    travelerPhotos = [],
    setSelectedFilter,
    selectedFilter,
  } = useImageViewer();
  const totalProviderPhotos = providerPhotos.length || 0;
  const totalTravelerPhotos = travelerPhotos.length || 0;
  const totalPhotos = totalProviderPhotos + totalTravelerPhotos;

  const handleFilterSelect = (key: FilterValues) => {
    setSelectedFilter(key);
  };

  return (
    <div>
      <div className={styles.filtersSection}>
        {galleryFilters(totalPhotos, totalProviderPhotos, totalTravelerPhotos, t).map(
          ({ label, value }) => (
            <Chip
              className={selectedFilter === value ? styles.selected : ''}
              key={value}
              onClick={() => handleFilterSelect(value as FilterValues)}
            >
              {label}
            </Chip>
          ),
        )}
      </div>
      {(!selectedFilter || selectedFilter === 'provider') && providerPhotos.length ? (
        <div className={styles.photosSection}>
          <div className={styles.title}>{t('productPage.providerPhotos')}</div>
          <div className={styles.grid}>
            {providerPhotos.map((url, index) => (
              <div key={url} className={styles.imageWrapper}>
                <Image
                  onClick={() => openModal(index)}
                  src={url}
                  alt="Photo"
                  width={168}
                  height={168}
                  className={styles.image}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {(!selectedFilter || selectedFilter === 'guests') && travelerPhotos.length ? (
        <div className={styles.photosSection}>
          <div className={styles.title}>{t('productPage.guestsPhotos')}</div>
          <div className={styles.grid}>
            {travelerPhotos.map((url, index) => (
              <div key={url} className={styles.imageWrapper}>
                <Image
                  onClick={() => openModal(index)}
                  src={url}
                  alt="Photo"
                  width={168}
                  height={168}
                  className={styles.image}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
