'use client';
import React, { FC, useState } from 'react';
import { MapPinIcon } from '@/app/_icons/MapPinIcon';
import { SearchIcon } from '@/app/_icons/SearchIcon';
import { LocationReference } from '@/app/_interfaces/product-response.interface';
import { styles } from './styles';
import { useTranslations } from 'next-intl';

interface PickupLocation {
  location: LocationReference;
  description: string;
  name: string;
  provider: string;
  providerReference: string;
  reference: string;
}

interface PickupPointsProps {
  title: string;
  pickupOptionType:
    | 'PICKUP_EVERYONE'
    | 'PICKUP_AND_MEET_AT_START_POINT'
    | 'MEET_EVERYONE_AT_START_POINT';
  locations: PickupLocation[];
}

export const PickupPoints: FC<PickupPointsProps> = ({
  title,
  pickupOptionType,
  locations,
}: PickupPointsProps) => {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(locations[0]);

  const filteredLocations = locations.filter((location: PickupLocation) =>
    location.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (location: PickupLocation) => {
    setSelectedLocation(location);
    setSearchTerm('');
  };

  const renderDetails = (location: PickupLocation) => (
    <div className={styles.details}>
      <strong>{location.provider || location.name || ''}</strong>
      <br />
      {location.description || ''}
    </div>
  );

  if (pickupOptionType === 'PICKUP_EVERYONE') {
    return (
      <div className={styles.listItem}>
        <div className={styles.iconWrapper}>
          <MapPinIcon />
        </div>
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>{title}</h3>
          {locations.map((location: any, index) => (
            <div key={index} className={styles.cardWrapper}>
              {renderDetails(location)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pickupOptionType === 'PICKUP_AND_MEET_AT_START_POINT') {
    return (
      <div className={styles.listItem}>
        <div className={styles.iconWrapper}>
          <MapPinIcon />
        </div>
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.searchWrapper}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('inputs.searchPickupPoints')}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedLocation && renderDetails(selectedLocation)}
          {searchTerm && (
            <div className={styles.listWrapper}>
              {filteredLocations.map((location: any, index) => (
                <div key={index} className={styles.listItem} onClick={() => handleSelect(location)}>
                  {location.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (pickupOptionType === 'MEET_EVERYONE_AT_START_POINT') {
    return (
      <div className={styles.listItem}>
        <div className={styles.iconWrapper}>
          <MapPinIcon />
        </div>
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.cardWrapper}>
            <div className={styles.details}>{locations[0].description}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
