import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import DropdownMenu from '../dropdown/DropdownMenu';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import DropdownItem from './DropdownItem';
import styles from './multiSelectDropdownMenu.module.scss';

interface Props {
  clearButtonLabel?: string;
  focusedIndex: number;
  id: string;
  isOpen: boolean;
  loadingSpinnerFinishedText?: string;
  loadingSpinnerText?: string;
  onClear: () => void;
  onItemChange: (val: OptionType) => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: OptionType[];
  searchPlaceholder?: string;
  showLoadingSpinner?: boolean;
  searchValue: string;
  value: OptionType[];
}

const MultiSelectDropdownMenu: React.FC<Props> = ({
  clearButtonLabel,
  focusedIndex,
  id,
  isOpen,
  loadingSpinnerFinishedText,
  loadingSpinnerText,
  onClear,
  onItemChange,
  onSearchChange,
  options,
  searchPlaceholder,
  searchValue,
  showLoadingSpinner,
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
      {showLoadingSpinner ? (
        <div className={styles.loadingSpinnerContainer} aria-hidden>
          <LoadingSpinner
            isLoading={showLoadingSpinner}
            loadingText={loadingSpinnerText}
            loadingFinishedText={loadingSpinnerFinishedText}
            small
            className={styles.loadingSpinner}
          />
          {loadingSpinnerText}
        </div>
      ) : (
        <>
          {options.map((option, index) => {
            return (
              <DropdownItem
                key={option.value}
                index={index}
                name={id}
                isChecked={value
                  .map((item) => item.value)
                  .includes(option.value)}
                isFocused={index === focusedIndex}
                onItemChange={onItemChange}
                option={option}
              />
            );
          })}
        </>
      )}
    </DropdownMenu>
  );
};

export default MultiSelectDropdownMenu;
