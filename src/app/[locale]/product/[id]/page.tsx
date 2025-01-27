import React, { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/styles';
import { ProductDescription } from '@/app/[locale]/product/[id]/components/ProductDescription';
import { ProductTravelerPhotos } from '@/app/[locale]/product/[id]/components/ProductTravelerPhotos';
import { ProductReviews } from '@/app/[locale]/product/[id]/components/ProductReviews';
import { ProductInclusions } from '@/app/[locale]/product/[id]/components/ProductInclusions';
import { ProductOverview } from '@/app/[locale]/product/[id]/components/ProductOverview';
import { ProductAdditionalInfo } from '@/app/[locale]/product/[id]/components/ProductAdditionalInfo';
import { ProductSampleMenu } from '@/app/[locale]/product/[id]/components/ProductSampleMenu';
import { ProductHints } from '@/app/[locale]/product/[id]/components/ProductHints';
import Faq from '@/app/_components/Faq';
import { FAQ_ITEMS } from '@/app/const';
import { BookingContextProvider } from '@/app/_contexts/bookingContext';
import { ImageViewerProvider } from '@/app/_contexts/imageViewerContext';
import { ProductExpectations } from '@/app/[locale]/product/[id]/components/ProductExpectations';
import { ProductAvailability } from '@/app/[locale]/product/[id]/components/ProductAvailability';
import { CheckoutSection } from './components/CheckoutSection';
import { fetchProductData, getProductDescription } from '@/app/[locale]/product/[id]/service';
import { ProductMeetingAndPickup } from '@/app/[locale]/product/[id]/components/ProductMeetingAndPickup';

interface ProductPageProps {
  params: { id: string };
  searchParams: { price: string; discount?: string };
}
const ProductPage: FC<ProductPageProps> = async ({
  params: { id: productCode },
  searchParams: { price, discount },
}) => {
  const [productData, productDescription] = await Promise.all([
    fetchProductData(productCode),
    getProductDescription(productCode),
  ]);

  const { providerPhotos, bookingNotAvailable } = productDescription;

  return (
    <ImageViewerProvider providerPhotos={providerPhotos} productCode={productCode}>
      <BookingContextProvider bookingNotAvailable={bookingNotAvailable}>
        <div className={styles.root}>
          <ProductDescription
            productCode={productCode}
            price={price}
            priceBeforeDiscount={discount}
          />
          <ProductAvailability productCode={productCode} />
          <ProductHints productCode={productCode} />
          <ProductOverview productCode={productCode} />
          <ProductSampleMenu productCode={productCode} />
          <ProductInclusions productCode={productCode} />
          <ProductExpectations productCode={productCode} />
          <ProductMeetingAndPickup product={productData} />
          <ProductAdditionalInfo productCode={productCode} />
          <ProductTravelerPhotos />
          <ProductReviews productCode={productCode} />
          <Faq className={styles.faqSection} items={FAQ_ITEMS} />
          <CheckoutSection productCode={productCode} />
        </div>
      </BookingContextProvider>
    </ImageViewerProvider>
  );
};

export default ProductPage;
