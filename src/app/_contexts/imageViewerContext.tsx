'use client';
import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import { ImageModal } from '@/app/_components/ImageViewerModal';
import { ReviewsBody, ReviewsResponse } from '@/app/api/getReviews/types';
import { API_ROUTES } from '@/app/_constants/api';
import { useRequest } from '@/app/_hooks/useRequest';

interface Review {
  title: string;
  text: string;
  publishedDate: string;
  userName: string;
  avatarUrl?: string;
  id: string;
}

export interface ImageViewerPhoto {
  review?: Review | null;
  url: string;
}

interface ImageViewerContext {
  isOpen: boolean;
  currentIndex: number;
  openModal: (index: number) => void;
  closeModal: () => void;
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterValues>>;
  selectedFilter: FilterValues;
  allPhotos: ImageViewerPhoto[];
  providerPhotos: string[];
  travelerPhotos: string[];
  openModalWithReviewsPhotos: (id: string) => void;
  reviews: ReviewsResponse | null;
}

interface ImageViewerProviderProps {
  children: ReactNode;
  providerPhotos: string[];
  productCode: string;
}

const initialContext = {
  isOpen: false,
  currentIndex: 0,
  openModal: () => {},
  closeModal: () => {},
  setSelectedFilter: () => {},
  openModalWithReviewsPhotos: () => {},
  allPhotos: [],
  providerPhotos: [],
  travelerPhotos: [],
  reviews: null,
  selectedFilter: null,
};

const ImageViewerContext = createContext<ImageViewerContext>(initialContext);

export type FilterValues = 'provider' | 'guests' | null;

export const ImageViewerProvider: FC<ImageViewerProviderProps> = ({
  children,
  providerPhotos: providerPhotoUrls,
  productCode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsWithPhotos, setReviewsWithPhotos] = useState<ImageViewerPhoto[]>([]);
  const [allPhotos, setAllPhotos] = useState<ImageViewerPhoto[]>([]);
  const [providerPhotos, setProviderPhotos] = useState<ImageViewerPhoto[]>([]);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterValues>(null);
  const createRequest = useRequest();

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleChangeImage = (direction: number) => {
    setCurrentIndex((prev) => prev + direction);
  };

  const openModalWithReviewsPhotos = (id: string) => {
    setAllPhotos(reviewsWithPhotos.filter((item) => item.review?.id === id));
    openModal(0);
  };

  const fetchReviewsWithPhotos = async (productCode: string) => {
    const reviewsData = await createRequest<ReviewsResponse, ReviewsBody>({
      endpoint: API_ROUTES.getReviews,
      body: {
        productCode: productCode,
        provider: 'ALL',
        count: 500,
        start: 1,
      },
    });

    const reviewsWithPhotos = reviewsData.reviews
      ?.filter((item) => item && Array.isArray(item.photosInfo) && item.photosInfo.length > 0)
      .flatMap((item) =>
        item.photosInfo!.flatMap((photoInfo) =>
          Array.isArray(photoInfo.photoVersions)
            ? photoInfo.photoVersions
                .filter((version) => version && version.height > 400 && version.height < 700)
                .map((version) => ({
                  review: {
                    title: item.title || '',
                    text: item.text || '',
                    publishedDate: item.publishedDate || '',
                    userName: item.userName || '',
                    id: item.reviewReference || '',
                    avatarUrl: item.avatarUrl || '',
                  },
                  url: version.url,
                }))
            : [],
        ),
      );

    setReviewsWithPhotos(reviewsWithPhotos);
    setReviews(reviewsData);
    return reviewsData;
  };

  useEffect(() => {
    if (!isOpen) {
      const byProvider = providerPhotoUrls?.map((url) => ({ review: null, url }));
      const byGuests = reviewsWithPhotos || [];

      setProviderPhotos(byProvider);

      setAllPhotos([...byProvider, ...byGuests]);
    }
  }, [providerPhotoUrls, reviewsWithPhotos, isOpen]);

  useEffect(() => {
    (async () => {
      const response = await fetchReviewsWithPhotos(productCode);
      if (!response?.reviews) {
        await fetchReviewsWithPhotos(productCode);
      }
    })();
  }, [productCode]);

  return (
    <ImageViewerContext.Provider
      value={{
        isOpen,
        currentIndex,
        allPhotos,
        openModal,
        closeModal,
        providerPhotos: providerPhotoUrls,
        travelerPhotos: reviewsWithPhotos?.map((item) => item.url) || [],
        openModalWithReviewsPhotos,
        reviews,
        setSelectedFilter,
        selectedFilter,
      }}
    >
      {children}
      {isOpen && (
        <ImageModal
          photos={
            selectedFilter === 'provider'
              ? providerPhotos
              : selectedFilter === 'guests'
                ? reviewsWithPhotos
                : allPhotos
          }
          currentIndex={currentIndex}
          handleChangeImage={handleChangeImage}
          closeModal={closeModal}
        />
      )}
    </ImageViewerContext.Provider>
  );
};

export const useImageViewer = () => {
  return useContext(ImageViewerContext);
};
