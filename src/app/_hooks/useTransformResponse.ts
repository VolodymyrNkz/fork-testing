import { SearchedDestination, FreeTextResponse } from '@/app/api/freeTextSearch/type';
import { Product } from '@/app/api/productSearch/types';
import { SearchListItemProps } from '@/app/_components/SearchListItem';
import { useSearch } from '@/app/_contexts/searchContext';
import { useCategories } from '@/app/_hooks/useCategories';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';

export type TTransformedData = SearchListItemProps[];

const MAX_RESULTS = 7;
const THUMBNAIL_HEIGHT = 40;

export const useTransformResponse = () => {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const { currency } = getUserInfo();

  const { tags, destinations } = useSearch();
  const { allAllowedCategories } = useCategories();

  const getTransformedResponse = (response: FreeTextResponse) => {
    const formattedDataByCategories = response.products.results?.filter((item) =>
      item.tags.some((id) => allAllowedCategories.includes(id)),
    );

    const matchedTags = tags
      .filter((tag) =>
        formattedDataByCategories
          ?.map((item) => item.tags)
          .flat(1)
          .filter((tag) => allAllowedCategories.includes(tag))
          .includes(tag.tagId),
      )
      .map((tag) => ({
        tagId: tag.tagId,
        name: tag.allNamesByLocale?.[locale],
      }));

    const transformedDestinations: SearchListItemProps[] =
      response?.destinations.results?.map((destination: SearchedDestination) => ({
        title: destination.name,
        subtitle: destination.parentDestinationName,
        type: 'destination',
      })) || [];

    const transformedProducts: SearchListItemProps[] =
      response.products.results
        ?.filter((product) => product.tags.some((tag) => allAllowedCategories.includes(tag)))

        .map((product: Product) => ({
          title: product.title,
          productCode: product.productCode,
          price: product.pricing.summary.fromPrice,
          priceWithDiscount: product.pricing.summary.fromPriceBeforeDiscount,
          subtitle: `${
            destinations.find((item) => item.destinationId === +product.destinations[0].ref)?.name
          } | ${t('common.from')} ${format.number(product.pricing.summary.fromPrice, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })}`,
          type: 'product',
          imgUrl: product.images[0].variants.find(({ height }) => height === THUMBNAIL_HEIGHT)?.url,
        })) || [];
    const transformedTags: SearchListItemProps[] = matchedTags.map((tag, index) => ({
      title: tag.name || '',
      subtitle:
        transformedDestinations?.[0]?.title ||
        transformedProducts[index]?.subtitle.split(' | ')[0] ||
        '',
      type: 'tag',
      tag: tag.tagId,
    }));

    return [...transformedDestinations, ...transformedTags, ...transformedProducts].slice(
      0,
      MAX_RESULTS,
    );
  };
  return { getTransformedResponse };
};
