import classNames from 'classnames';
import { css } from 'emotion';
import { IconAngleDown } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import { OptionType } from '../../../types';
import DropdownMenu from './DropdownMenu';
import styles from './multiSelectDropdown.module.scss';

export interface MultiselectDropdownProps {
  icon: React.ReactElement;
  id?: string;
  onChange: (values: OptionType[]) => void;
  options: OptionType[];
  renderOptionText?: (option: OptionType) => React.ReactChild;
  searchPlaceholder?: string;
  searchValue?: string;
  setSearchValue?: (newVal: string) => void;
  showSearch?: boolean;
  toggleButtonLabel: string;
  value: OptionType[];
}

const MultiSelectDropdown: React.FC<MultiselectDropdownProps> = ({
  icon,
  id: _id,
  onChange,
  options,
  renderOptionText,
  searchPlaceholder,
  searchValue: _searchValue,
  setSearchValue,
  showSearch = false,
  toggleButtonLabel,
  value,
}) => {
  const { theme } = useTheme();
  const id = _id || uniqueId('multi-select-dropdown');
  const toggleButtonId = `${id}-toggle-button`;
  const menuId = `${id}-menu`;
  const [internalSearchValue, setInternalSearchValue] = React.useState('');
  const searchValue =
    _searchValue !== undefined ? _searchValue : internalSearchValue;

  const dropdown = React.useRef<HTMLDivElement | null>(null);
  const toggleButton = React.useRef<HTMLButtonElement | null>(null);

  const filteredOptions = React.useMemo(() => {
    return [
      ...options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      ),
    ].filter((e) => e) as OptionType[];
  }, [options, searchValue]);

  const handleInputValueChange = React.useCallback(
    (val: string) => {
      setInternalSearchValue(val);

      if (setSearchValue) {
        setSearchValue(val);
      }
    },
    [setSearchValue]
  );

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
        case 'ArrowUp':
          ensureMenuIsOpen();
          break;
        case 'ArrowDown':
          ensureMenuIsOpen();
          break;
      }
    },
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    const current = dropdown.current;

    // Close menu when clicking outside of the component
    if (!(target instanceof Node && current?.contains(target))) {
      setIsMenuOpen(false);
    }
  };

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

  const handleDocumentFocusin = (event: FocusEvent) => {
    const target = event.target;
    const current = dropdown.current;

    if (!(target instanceof Node && current?.contains(target))) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    setupKeyboardNav();
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('focusin', handleDocumentFocusin);
    // Clean up event listener to prevent memory leaks
    return () => {
      teardownKeyboardNav();
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('focusin', handleDocumentFocusin);
    };
  }, [setupKeyboardNav, teardownKeyboardNav]);

  const handleClear = React.useCallback(() => {
    onChange([]);
    handleInputValueChange('');
  }, [handleInputValueChange, onChange]);

  const handleItemChange = (option: OptionType) => {
    toggleOption(option);
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleInputValueChange(event.target.value);
  };

  const selectedText = React.useMemo(() => {
    const valueLabels = value
      .map((val) => {
        if (renderOptionText) {
          return renderOptionText(val);
        } else {
          return options.find((option) => option.value === val.value)?.label;
        }
      })
      .sort();
    return valueLabels.length > 1
      ? `${valueLabels[0]} + ${valueLabels.length - 1}`
      : valueLabels[0];
  }, [options, renderOptionText, value]);

  React.useEffect(() => {
    if (!isMenuOpen) {
      handleInputValueChange('');
    }
  }, [handleInputValueChange, isMenuOpen]);

  return (
    <div
      className={classNames(
        styles.dropdown,
        { [styles.open]: isMenuOpen },
        css(theme.multiSelectDropdown)
      )}
      ref={dropdown}
    >
      <button
        ref={toggleButton}
        aria-controls={menuId}
        aria-expanded={isMenuOpen}
        aria-label={toggleButtonLabel}
        className={styles.toggleButton}
        id={toggleButtonId}
        onClick={toggleMenu}
        type="button"
      >
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
        <div className={styles.title}>{selectedText || toggleButtonLabel}</div>
        <IconAngleDown className={styles.angleIcon} aria-hidden />
      </button>
      <DropdownMenu
        focusedIndex={focusedIndex}
        id={menuId}
        isOpen={isMenuOpen}
        onClear={handleClear}
        onItemChange={handleItemChange}
        onSearchChange={handleSearchValueChange}
        options={filteredOptions}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        showSearch={showSearch}
        value={value}
      />
    </div>
  );
};

export default MultiSelectDropdown;
