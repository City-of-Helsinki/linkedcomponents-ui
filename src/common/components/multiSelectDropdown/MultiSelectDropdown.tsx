import React from 'react';
import { useTranslation } from 'react-i18next';

import useDropdownCloseEvents from '../../../hooks/useDropdownCloseEvents';
import useKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { OptionType } from '../../../types';
import skipFalsyType from '../../../utils/skipFalsyType';
import Dropdown from '../dropdown/Dropdown';
import ToggleButton from '../dropdown/toggleButton/ToggleButton';
import MultiSelectDropdownMenu from './multiSelectDropdownMenu/MultiSelectDropdownMenu';

export interface MultiselectDropdownProps {
  clearButtonLabel?: string;
  icon?: React.ReactElement;
  id?: string;
  loadingSpinnerFinishedText?: string;
  loadingSpinnerText?: string;
  onChange: (values: OptionType[]) => void;
  options: OptionType[];
  renderOptionText?: (option: OptionType) => React.ReactChild;
  searchPlaceholder?: string;
  searchValue?: string;
  setSearchValue?: (newVal: string) => void;
  showSearch?: boolean;
  showLoadingSpinner?: boolean;
  toggleButtonLabel: string;
  value: OptionType[];
}

const MultiSelectDropdown: React.FC<MultiselectDropdownProps> = ({
  clearButtonLabel,
  icon,
  id: _id,
  loadingSpinnerFinishedText,
  loadingSpinnerText,
  onChange,
  options,
  renderOptionText,
  searchPlaceholder,
  searchValue: _searchValue,
  setSearchValue,
  showLoadingSpinner,
  showSearch,
  toggleButtonLabel,
  value,
}) => {
  const { t } = useTranslation();
  const id = useIdWithPrefix({ id: _id, prefix: 'multi-select-dropdown-' });
  const toggleButtonId = `${id}-toggle-button`;
  const menuId = `${id}-menu`;
  const [internalSearchValue, setInternalSearchValue] = React.useState('');
  const searchValue = _searchValue ?? internalSearchValue;

  const dropdown = React.useRef<HTMLDivElement | null>(null);
  const toggleButton = React.useRef<HTMLButtonElement | null>(null);

  const filteredOptions = React.useMemo(() => {
    return [
      ...options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      ),
    ].filter(skipFalsyType);
  }, [options, searchValue]);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  useDropdownCloseEvents({
    container: dropdown,
    isMenuOpen,
    setIsMenuOpen,
  });

  const {
    focusedIndex,
    setup: setupKeyboardNav,
    teardown: teardownKeyboardNav,
  } = useKeyboardNavigation({
    container: dropdown,
    listLength: filteredOptions.length,
    onKeyDown: (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          setIsMenuOpen(false);
          setFocusToToggleButton();
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          ensureMenuIsOpen();
          break;
      }
    },
  });

  const toggleOption = React.useCallback(
    (option: OptionType) => {
      onChange(
        value.map((item) => item.value).includes(option.value)
          ? value.filter((v) => v.value !== option.value)
          : [...value, option]
      );
    },
    [onChange, value]
  );

  const ensureMenuIsOpen = React.useCallback(() => {
    /* istanbul ignore else */
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen]);

  const setFocusToToggleButton = () => {
    toggleButton.current?.focus();
  };

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  React.useEffect(() => {
    setupKeyboardNav();

    return () => {
      teardownKeyboardNav();
    };
  }, [setupKeyboardNav, teardownKeyboardNav]);

  const handleItemChange = (option: OptionType) => {
    toggleOption(option);
  };

  const handleSearchValueChange = React.useCallback(
    (val: string) => {
      setInternalSearchValue(val);

      if (setSearchValue) {
        setSearchValue(val);
      }
    },
    [setSearchValue]
  );

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleSearchValueChange(event.target.value);
  };

  const handleClear = React.useCallback(() => {
    onChange([]);
    handleSearchValueChange('');
  }, [handleSearchValueChange, onChange]);

  const selectedText = React.useMemo(() => {
    const valueLabels = value
      .map(
        (val) =>
          renderOptionText?.(val) ??
          options.find((option) => option.value === val.value)?.label
      )
      .sort();
    return valueLabels.length > 1
      ? `${valueLabels[0]} + ${valueLabels.length - 1}`
      : valueLabels[0];
  }, [options, renderOptionText, value]);

  React.useEffect(() => {
    if (!isMenuOpen) {
      handleSearchValueChange('');
    }
  }, [handleSearchValueChange, isMenuOpen]);

  return (
    <Dropdown ref={dropdown}>
      <ToggleButton
        ref={toggleButton}
        icon={icon}
        id={toggleButtonId}
        isOpen={isMenuOpen}
        menuId={menuId}
        onClick={toggleMenu}
        selectedText={selectedText?.toString()}
        toggleButtonLabel={toggleButtonLabel}
      />
      <MultiSelectDropdownMenu
        clearButtonLabel={clearButtonLabel}
        focusedIndex={focusedIndex}
        id={menuId}
        isOpen={isMenuOpen}
        loadingSpinnerFinishedText={loadingSpinnerFinishedText}
        loadingSpinnerText={
          loadingSpinnerText || (t('common.loading') as string)
        }
        onClear={handleClear}
        onItemChange={handleItemChange}
        onSearchChange={showSearch ? handleSearchInputChange : undefined}
        options={filteredOptions}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        showLoadingSpinner={showLoadingSpinner}
        value={value}
      />
    </Dropdown>
  );
};

export default MultiSelectDropdown;
