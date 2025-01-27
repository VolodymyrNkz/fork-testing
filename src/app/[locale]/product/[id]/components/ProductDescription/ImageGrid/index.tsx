'use client';
import { FC } from 'react';
import Image from 'next/image';
import { styles } from '@/app/[locale]/product/[id]/components/ProductDescription/ImageGrid/styles';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { ImageGallery } from '@/app/_components/ImageGallery';
import { useTranslations } from 'next-intl';
import { useImageViewer } from '@/app/_contexts/imageViewerContext';

interface ImageGridProps {
  photos: string[];
  chunkNumber: number;
  isLast?: boolean;
  isFirst?: boolean;
}

export const ImageGrid: FC<ImageGridProps> = ({ photos, isLast, isFirst }) => {
  const t = useTranslations();
  const { setSelectedFilter } = useImageViewer();

  const renderImage = (src?: string, alt?: string) => {
    if (src) {
      return (
        <Image src={src} width={200} height={200} alt={alt || 'Image'} className={styles.image} />
      );
    }
    return null;
  };

  const renderImages = () => {
    if (photos.length === 1) {
      return (
        <div className={styles.singleGrid} style={{ marginRight: 21 }}>
          <div className={styles.largeImageWrapper}>{renderImage(photos[0], 'Single Image')}</div>
        </div>
      );
    }

    if (photos.length === 2) {
      return (
        <div className={styles.container} style={{ marginLeft: 21 }}>
          <div className={styles.largeImageWrapper}>{renderImage(photos[0], 'Large')}</div>
          <div className={styles.tallImageWrapper}>{renderImage(photos[1], 'Tall')}</div>
        </div>
      );
    }

    return (
      <div
        className={styles.container}
        style={isLast && !isFirst ? { marginRight: 21 } : isFirst ? { marginLeft: 21 } : {}}
      >
        <div className={styles.largeImageWrapper}>{renderImage(photos[0], 'Large')}</div>

        <div className={styles.smallImageWrapper}>{renderImage(photos[1], 'Small 1')}</div>

        <div className={styles.smallImageWrapper}>
          {isLast ? (
            <div className={styles.overlayContainer}>
              <div className={styles.blurOverlay}></div>
              <div className={styles.blurImageWrapper}>{renderImage(photos[2], 'Small 2')}</div>
              <span className={styles.seeMoreText}>{t('buttons.seeMore')}</span>
            </div>
          ) : (
            renderImage(photos[2], 'Small 2')
          )}
        </div>
      </div>
    );
  };

  return (
    <FullScreenPanel
      title={t('common.photos')}
      trigger={<div onClick={() => setSelectedFilter(null)}>{renderImages()}</div>}
    >
      <ImageGallery />
    </FullScreenPanel>
  );
};
