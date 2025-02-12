import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { styles } from './styles';
import type { LocationPoint as Location } from '../../../_hooks/useProductLocations';
import { DropdownSearchInput } from '@/app/_components/DropdownSearchInput';
import {
  getLocationProviderReferenceLink,
  getLocationProviderReferenceInfo,
  highlightMatchingText,
} from '../../../utils';
import { cn } from '@/app/_helpers/tw';
import { LocationBulkResponse } from '@/app/_interfaces/product-response.interface';
import { useBooking } from '@/app/_contexts/bookingContext';

interface Props {
  icon?: React.ReactNode;
  locations: Location[];
  title: string;
}

interface ReferenceInfo {
  name: string;
  address: string;
}

export const ProviderReferenceLink: FC<{ location: LocationBulkResponse; className?: string }> = ({
  location,
  className,
}) => {
  const [referenceInfo, setReferenceInfo] = useState<ReferenceInfo>({ name: '', address: '' });
  const link = getLocationProviderReferenceLink(location);

  useEffect(() => {
    const fetchName = async () => {
      const referenceInfo = await getLocationProviderReferenceInfo(location);
      if (referenceInfo) {
        setReferenceInfo({ address: referenceInfo?.address, name: referenceInfo?.name });
      }
    };

    fetchName();
  }, [location]);

  if (!link || !referenceInfo) {
    return null;
  }

  return (
    <>
      <p>{referenceInfo.name}</p>
      <a href={link} target="_blank" rel="noreferrer" className={className}>
        {referenceInfo.address}
      </a>
    </>
  );
};

const highlight = highlightMatchingText({ className: 'text-primary font-bold bg-transparent' });

export const LocationPoint: React.FC<PropsWithChildren<Props>> = ({
  title,
  locations,
  icon,
  children,
}) => {
  const { handleSetPickupLocationReference } = useBooking();

  const [selectedLocation, setSelectedLocation] = useState(
    locations.length > 1 ? null : locations[0],
  );

  const reference = selectedLocation?.reference || '';

  const options = locations.map((location) => ({
    label: location.name || '',
    value: location.reference,
    ...location,
  }));

  const handleSelectPoint = (reference: string) => {
    const location = locations.find((location) => location.reference === reference) || null;

    setSelectedLocation(location);
    if (location) {
      handleSetPickupLocationReference(location.reference);
    }
  };

  const renderOption = (option: (typeof options)[0], value?: string) => (
    <div
      className={cn('flex flex-col gap-1 p-2 ps-5 text-base hover:bg-backgroundLight', {
        'bg-secondary': option.value === reference,
      })}
    >
      <span
        className="text-textPrimary"
        dangerouslySetInnerHTML={{ __html: highlight(option.label, value || '') }}
      />
      {option.address ? (
        <span className="text-textSecondary">
          {[
            option.address.street,
            option.address.administrativeArea || option.address.state,
            option.address.postcode,
            option.address.country,
          ]
            .filter(Boolean)
            .join(', ')}
        </span>
      ) : (
        <ProviderReferenceLink location={option} className="text-primary" />
      )}
    </div>
  );

  return (
    <div className={styles.listItem}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className="flex flex-1 flex-col">
        <div className={styles.listItemTitle}>{title}</div>
        {options.length > 1 && (
          <DropdownSearchInput
            options={options}
            onSelect={handleSelectPoint}
            renderOption={renderOption}
            menuClassName="max-h-[300px]"
          />
        )}

        <div className="mt-4 flex flex-col gap-2">
          {selectedLocation && (
            <>
              <p className="empty:hidden">
                {selectedLocation.address ? (
                  <>
                    {[
                      selectedLocation.address.street,
                      selectedLocation.address.administrativeArea || selectedLocation.address.state,
                      selectedLocation.address.postcode,
                      selectedLocation.address.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </>
                ) : (
                  ''
                )}
              </p>
              <ProviderReferenceLink location={selectedLocation} className="text-primary" />
              <div className={styles.listItemText}>{selectedLocation.description}</div>
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
