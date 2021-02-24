import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import DropdownMenu from '../dropdown/DropdownMenu';
import DropdownItem from './DropdownItem';

interface Props {
  clearButtonLabel?: string;
  focusedIndex: number;
  id: string;
  isOpen: boolean;
  onClear: () => void;
  onItemChange: (val: OptionType) => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: OptionType[];
  searchPlaceholder?: string;
  searchValue: string;
  value: OptionType[];
}

const MultiSelectDropdownMenu: React.FC<Props> = ({
  clearButtonLabel,
  focusedIndex,
  id,
  isOpen,
  onClear,
  onItemChange,
  onSearchChange,
  options,
  searchPlaceholder,
  searchValue,
  value,
}) => {
  const { t } = useTranslation();

  const searchRef = React.useRef<HTMLInputElement | null>(null);

  const searchPlaceholderText =
    searchPlaceholder || t('common.multiSelectDropdown.searchPlaceholder');

  const setFocusToInput = () => {
    searchRef.current?.focus();
  };

  React.useEffect(() => {
    if (isOpen) {
      setFocusToInput();
    }
  }, [isOpen]);

  return (
    <DropdownMenu
      clearButtonLabel={clearButtonLabel || t('common.dropdown.buttonClear')}
      onClear={onClear}
      onSearchChange={onSearchChange}
      id={id}
      isOpen={isOpen}
      searchPlaceholder={searchPlaceholderText}
      searchRef={searchRef}
      searchValue={searchValue}
    >
      {options.map((option, index) => {
        return (
          <DropdownItem
            key={option.value}
            index={index}
            name={id}
            isChecked={value.map((item) => item.value).includes(option.value)}
            isFocused={index === focusedIndex}
            onItemChange={onItemChange}
            option={option}
          />
        );
      })}
    </DropdownMenu>
  );
};

export default MultiSelectDropdownMenu;
