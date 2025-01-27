'use client';
import { useEffect, useState } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductTravelerPhotos/styles';
import Image from 'next/image';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { ImageGallery } from '@/app/_components/ImageGallery';
import { useImageViewer } from '@/app/_contexts/imageViewerContext';
import { useTranslations } from 'next-intl';

export const ProductTravelerPhotos = () => {
  const t = useTranslations();
  const [photos, setPhotos] = useState<string[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const { travelerPhotos, setSelectedFilter } = useImageViewer();

  useEffect(() => {
    setPhotos(travelerPhotos.slice(0, 3));
    setTotalPhotos(travelerPhotos.length);
  }, [travelerPhotos]);

  if (!photos.length) {
    return undefined;
  }

  return (
    <div>
      <div className={styles.title}>{t('productPage.travelerPhotos')}</div>
      <div className={styles.photosList}>
        {photos?.map((url, index) => (
          <FullScreenPanel
            title={t('common.photos')}
            key={index}
            trigger={
              <div onClick={() => setSelectedFilter('guests')}>
                {index === 2 && totalPhotos > 3 ? (
                  <div className={styles.overlayContainer}>
                    <div className={styles.blurOverlay} />
                    <div className={styles.blurImageWrapper}>
                      <Image
                        width={108}
                        height={108}
                        className={styles.photo}
                        src={photos?.[2]}
                        alt="Traveler photo"
                      />
                    </div>
                    <span className={styles.seeMoreText}>
                      {t('buttons.seeOtherPhotos', { count: totalPhotos - 2 })}
                    </span>
                  </div>
                ) : (
                  <Image
                    width={108}
                    height={108}
                    className={styles.photo}
                    src={url}
                    key={index}
                    alt="Traveler photo"
                  />
                )}
              </div>
            }
          >
            <ImageGallery />
          </FullScreenPanel>
        ))}
      </div>
    </div>
  );
};
