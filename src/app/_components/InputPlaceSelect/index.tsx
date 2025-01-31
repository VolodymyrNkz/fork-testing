'use client';
import React, { useState, useCallback, useRef, useEffect, FC } from 'react';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { CustomInput } from '@/app/_components/CustomInput';
import { SearchListItem } from '@/app/_components/SearchListItem';
import { mockSearchPlaces } from '@/app/[locale]/results/_components/Navigation/mock';
import { SearchIcon } from '@/app/_icons/SearchIcon';
import { styles } from '@/app/_components/InputPlaceSelect/styles';
import debounce from 'lodash.debounce';
import { useTransformResponse, TTransformedData } from '@/app/_hooks/useTransformResponse';
import { FreeTextBody, FreeTextResponse } from '@/app/api/freeTextSearch/type';
import { useSearch } from '@/app/_contexts/searchContext';
import Skeleton from '@/app/_components/Skeleton';
import { API_ROUTES } from '@/app/_constants/api';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/app/_hooks/useLocation';
import { getCurrencyByCountry } from '@/app/_helpers/getCurrencyByCountry';
import { useRequest } from '@/app/_hooks/useRequest';

interface InputPlaceSelectProps {
  handlePlaceChange?: (value: string) => void;
  customTitle?: string;
  customPlaceholder?: string;
}

export const InputPlaceSelect: FC<InputPlaceSelectProps> = () => {
  const t = useTranslations('inputs');
  const tSearchPlaces = useTranslations('searchPlaces');
  const { currency: userCurrency } = getUserInfo();

  const title = t('placeOrActivity');

  const {
    handleSetDestinationFilter,
    searchedDestination,
    tags,
    searchInputValue,
    setSearchInputValue,
  } = useSearch();
  const searchParams = useSearchParams();

  const { getTransformedResponse } = useTransformResponse();
  const createRequest = useRequest();

  const [searchValue, setSearchValue] = useState<string>('');
  const [results, setResults] = useState<TTransformedData>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('searchTerm')) {
      setSearchInputValue(searchParams.get('searchTerm') || '');
    }
  }, []);

  const searchValueRef = useRef(searchValue);

  const { city: nearbyCity, country: nearbyCountry } = useLocation();
  const nearbyLocation = [nearbyCity, nearbyCountry].filter(Boolean).join(', ') || 'me';

  const currency = userCurrency || getCurrencyByCountry(nearbyCountry.toLowerCase());

  const handleToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSearch = async () => {
    if (!searchValueRef.current.trim() && !isModalOpen) {
      return;
    }

    setLoading(true);

    const body: FreeTextBody = {
      searchTerm: searchValueRef.current,
      currency,
      searchTypes: [
        {
          searchType: 'DESTINATIONS',
          pagination: {
            start: 1,
            count: 3,
          },
        },
        {
          searchType: 'PRODUCTS',
          pagination: {
            start: 1,
            count: 50,
          },
        },
      ],
    };

    try {
      const data = await createRequest<FreeTextResponse, FreeTextBody>({
        endpoint: API_ROUTES.freeTextSearch,
        body,
      });
      setResults(getTransformedResponse(data));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => handleSearch(), 500),
    [tags],
  );

  const onChangeHandler = (value: string) => {
    setSearchValue(value);
    setSearchInputValue(value);
    if (value) {
      debouncedSearch();
    }
  };

  useEffect(() => {
    if (!searchValue) {
      setResults([]);
    }
    searchValueRef.current = searchValue;

    if (searchedDestination && searchValue) {
      debouncedSearch();
    }
  }, [searchValue, searchedDestination]);

  useEffect(() => {
    if (!searchValue) {
      setSearchValue(searchedDestination);
    }
  }, [searchedDestination]);

  const handleProceedSearch = (value: string) => {
    handleSetDestinationFilter(value);
    handleToggle();
  };

  const handleItemSelect = (title: string) => {
    setSearchValue(title);

    handleToggle();
  };

  useEffect(() => {
    handleSearch();
  }, [userCurrency]);

  return (
    <BottomSheet
      fullHeight
      toggle={handleToggle}
      isOpen={isModalOpen}
      title={title}
      triggerComponent={
        <CustomInput
          className="text-textSecondary"
          icon={SearchIcon}
          readonly
          value={searchInputValue}
          placeholder={searchInputValue ? '' : title}
        />
      }
      footer={
        searchInputValue ? (
          <div
            className={styles.searchButtonContainer}
            onClick={() => handleProceedSearch(searchInputValue)}
          >
            <div className={styles.iconContainer}>
              <SearchIcon className={styles.icon} />
            </div>
            <span>{t('searchFor')}</span>
            <b className={styles.searchedValue}>
              <q>{searchInputValue}</q>
            </b>
          </div>
        ) : undefined
      }
      header={
        <>
          <CustomInput
            icon={SearchIcon}
            value={searchInputValue}
            onChange={onChangeHandler}
            placeholder={searchInputValue ? t('searchResult') : t('searchForAPlace')}
          />
        </>
      }
    >
      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 7 }).map((_, index) => <Skeleton key={index} height={30} mb={0} />)
        ) : results.length ? (
          results?.map(({ title, type, subtitle, imgUrl, tag, productCode }, index) => {
            if (type === 'product') {
              return (
                <Link href={`${NAVIGATION_ROUTES.product}${productCode}`} key={index}>
                  <SearchListItem
                    onClick={() => handleItemSelect(title)}
                    tag={tag}
                    imgUrl={imgUrl}
                    title={title}
                    type={type}
                    subtitle={subtitle}
                  />
                </Link>
              );
            }

            return (
              <SearchListItem
                onClick={() => handleItemSelect(title)}
                tag={tag}
                key={index}
                imgUrl={imgUrl}
                title={title}
                type={type}
                subtitle={subtitle}
              />
            );
          })
        ) : (
          <>
            <SearchListItem
              title={t('nearMe', { value: nearbyLocation })}
              subtitle=""
              onClick={() => {
                setSearchInputValue(nearbyLocation);
                handleItemSelect(nearbyCity);
                handleSetDestinationFilter(nearbyCity);
              }}
              type="destination"
              filled
            />
            <h4 className={styles.h4}>{t('suggestions')}</h4>
            {mockSearchPlaces(tSearchPlaces).map(({ id, title, subtitle }) => (
              <SearchListItem
                onClick={() => handleItemSelect(title)}
                key={id}
                title={title}
                type="destination"
                subtitle={subtitle}
              />
            ))}
          </>
        )}
      </div>
    </BottomSheet>
  );
};
