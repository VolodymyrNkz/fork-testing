import { cn } from '@/app/_helpers/tw';
import { useClickOutside } from '@/app/_hooks/useClickOutside';
import { CrossIconRounded } from '@/app/_icons/CrossIconRounded';
import { SearchIcon } from '@/app/_icons/SearchIcon';
import { useTranslations } from 'next-intl';
import {
  ChangeEventHandler,
  ElementRef,
  KeyboardEventHandler,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { RenderIfVisible } from './components/RenderInView';

type Props<T extends { label: string; value: string }> = {
  options: T[];
  renderOption?: (option: T, value?: T['value']) => ReactNode;
  onSelect?: (value: T['value']) => void;
  placeholder?: string;
  menuClassName?: string;
};

const ITEM_HEIGHT = 48;
const VISIBLE_OFFSET = ITEM_HEIGHT * 10;

export const DropdownSearchInput = <T extends { label: string; value: string }>({
  options,
  onSelect,
  placeholder: placeholderText,
  renderOption = (option) => option.label,
  menuClassName,
}: Props<T>) => {
  const t = useTranslations('inputs');
  const defaultPlaceholder = placeholderText || t('typeToSearch');

  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

  const listRef = useRef<ElementRef<'div'>>(null);

  const ref = useClickOutside(() => {
    setIsOpen(false);

    if (!isSelected && value !== '') {
      setValue('');
    }
  });

  const handleSelect = (value: T['value'], label: T['label']) => {
    setValue('');
    onSelect?.(value);
    setIsOpen(false);
    setIsSelected(true);
    setPlaceholder(label || defaultPlaceholder);
  };

  const handleClear = () => {
    if (isSelected && value === '') {
      setIsSelected(false);
      onSelect?.('');
      setPlaceholder(defaultPlaceholder);
    }

    setValue('');
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Backspace' || (e.key === 'Delete' && value == '')) {
      handleClear();
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const filteredOptions = options
    .filter(({ label }) => label.toLowerCase().includes(value.toLowerCase()))
    .map((option, index) => (
      <RenderIfVisible
        key={option.value}
        initialVisible={index <= 10}
        visibleOffset={VISIBLE_OFFSET}
        root={listRef.current!}
        stayRendered
      >
        <div
          role="option"
          aria-selected={option.value === value}
          onClick={() => handleSelect(option.value, option.label)}
          className="cursor-pointer"
        >
          {renderOption?.(option, value)}
        </div>
      </RenderIfVisible>
    ));

  return (
    <div ref={ref} className="relative flex flex-col gap-4">
      <label className="flex w-full items-center gap-2 rounded-md p-2 ring-1 ring-borderDark focus-within:ring-2 focus-within:ring-primary">
        <SearchIcon />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex flex-1 text-button font-medium placeholder-textSecondary',
            'focus:outline-none focus:ring-0',
            { 'placeholder:text-textPrimary': isSelected },
          )}
        />
        <CrossIconRounded
          onClick={handleClear}
          className={cn('invisible cursor-pointer', {
            visible: value !== '' || (isSelected && isOpen),
          })}
        />
      </label>

      <div
        ref={listRef}
        role="listbox"
        className={cn(
          menuClassName,
          'absolute left-0 top-[50px] z-50 flex w-full flex-col gap-1 overflow-y-auto rounded-md border border-borderDark bg-white',
          {
            hidden: !isOpen,
          },
        )}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions
        ) : (
          <li className="list-none p-2 ps-5">{t('noResults')}</li>
        )}
      </div>
    </div>
  );
};
