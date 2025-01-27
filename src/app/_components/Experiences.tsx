'use client';
import React from 'react';
import { useLocation } from '@/app/_hooks/useLocation';
import { useProducts } from '@/app/_hooks/useProducts';
import ExperienceSection from '@/app/_components/ExperienceSection';
import ExperienceCard from '@/app/_components/ExperienceCard';
import { EXPERIENCE_CATEGORIES } from '@/app/const';
import ExperienceCategory from '@/app/_components/ExperienceCategory';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import getExperienceFromProduct from '@/app/_helpers/getExperienceFromProduct';
import Loading from '@/app/[locale]/loading';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { defaultFilters, useSearch } from '../_contexts/searchContext';

const Experiences = () => {
  const { city, currency } = useLocation();
  const t = useTranslations();

  const { mappedDestinations } = useSearch();

  const destination = mappedDestinations[city]?.destinationId;

  const sections = !destination
    ? []
    : [
        {
          title: t('landingPage.topExperiencesIn', { value: city }),
          experiencesFilters: {
            filtering: {
              destination,
              tags: ['21911', '11891'],
            },
            currency,
            pagination: {
              start: 1,
              count: 5,
            },

            sorting: {
              sort: 'DEFAULT',
              order: 'DESCENDING',
            },
          },
          configuration: {
            rating: { from: 4, to: 5 },
          },
        },
        {
          title: t('landingPage.bestDeals'),
          experiencesFilters: {
            filtering: {
              destination,
              tags: ['21911'],
              rating: { from: 1, to: 5 },
              flags: ['SPECIAL_OFFER'],
            },
            currency,
            pagination: {
              start: 1,
              count: 5,
            },
            sorting: {
              sort: 'DEFAULT',
              order: 'DESCENDING',
            },
          },
          configuration: {
            flags: ['SPECIAL_OFFER'],
            rating: { from: 4, to: 5 },
          },
        },
        {
          title: t('landingPage.mostPopular'),
          experiencesFilters: {
            filtering: {
              destination,
              tags: ['11891', '21911'],
            },
            currency,
            pagination: {
              start: 1,
              count: 5,
            },
            sorting: {
              sort: 'TRAVELER_RATING',
              order: 'DESCENDING',
            },
          },
          configuration: {
            tagId: 11891,
            rating: { from: 4, to: 5 },
          },
        },
      ];

  sections.forEach((section) => {
    section.experiencesFilters.filtering = {
      ...defaultFilters,
      ...section.experiencesFilters.filtering,
    };
  });

  const { data, loading } = useProducts(city, sections);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-lg my-11 me-5 space-y-10 overflow-hidden">
      {data?.map(({ products, title }, index) => {
        // TODO: check if API actually sends localized title, may not work with other languages, relying on order is WA
        if (title === t('landingPage.topExperiencesIn', { value: city }) || index === 0) {
          products = products.toSorted((a, b) => b.reviews.totalReviews - a.reviews.totalReviews);
        }

        return (
          <ExperienceSection
            {...sections[index].configuration}
            key={index}
            destinationName={city}
            title={title}
          >
            {products?.map((product: any) => {
              const fromPrice = product.pricing.summary.fromPrice;
              const priceWithDiscount = product.pricing.summary.fromPriceBeforeDiscount;
              const experience = getExperienceFromProduct(product, t);

              return (
                <Link
                  key={product.productCode}
                  href={`${NAVIGATION_ROUTES.product}${product.productCode}?price=${fromPrice}${
                    priceWithDiscount ? `&discount=${priceWithDiscount}` : ''
                  }`}
                >
                  <ExperienceCard key={experience.title} {...experience} />
                </Link>
              );
            })}
          </ExperienceSection>
        );
      })}
      <ExperienceSection destinationName={city} title={t('landingPage.discoverAll')}>
        {EXPERIENCE_CATEGORIES.map((category) => (
          <ExperienceCategory destinationName={city} key={category.name} {...category} />
        ))}
      </ExperienceSection>
    </div>
  );
};

export default Experiences;
