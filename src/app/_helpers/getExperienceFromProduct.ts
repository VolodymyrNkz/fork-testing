import { ViatorProductResponse } from '@/app/_interfaces/viator-product-response.interface';
import { Experience } from '@/app/_interfaces/experience.interface';
import { getBestImageVariant } from '@/app/_helpers/getBestImageVariant';

export default function getExperienceFromProduct(
  product: ViatorProductResponse,
  t: any,
): Experience {
  return {
    imageSrc: getBestImageVariant(product.images),
    title: product.title || t('fallbacks.noTitle'),
    rating: Math.ceil(product.reviews?.combinedAverageRating) || 0,
    reviews: product.reviews?.totalReviews || 0,
    duration: product.duration?.fixedDurationInMinutes
      ? t('common.time.hoursOnly', {
          hours: Math.round((product.duration.fixedDurationInMinutes / 60) * 1000) / 1000,
        })
      : t('fallbacks.unknownDuration'),
    cancellationPolicy: product.flags?.includes('FREE_CANCELLATION')
      ? t('common.freeCancellation')
      : '',
    price: product.pricing?.summary?.fromPrice?.toFixed(2) || 'N/A',
    originalPrice: product.pricing?.summary?.fromPriceBeforeDiscount?.toFixed(2) || null,
  };
}
