import {
  ViatorImageVariant,
  ViatorProductImage,
} from '@/app/_interfaces/viator-product-response.interface';

export const getBestImageVariant = (images: ViatorProductImage[], targetWidth = 288): string => {
  const imageVariants: Array<ViatorImageVariant> = images.flatMap((image: any) =>
    image.variants.map((variant: any) => ({
      url: variant.url,
      width: variant.width,
      height: variant.height,
    })),
  );

  const bestVariant = imageVariants.reduce((best, current) => {
    return Math.abs(current.width - targetWidth) < Math.abs(best.width - targetWidth)
      ? current
      : best;
  }, imageVariants[0]);

  return bestVariant.url;
};
