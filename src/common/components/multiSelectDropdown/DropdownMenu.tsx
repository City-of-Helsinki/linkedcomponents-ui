import { IconSearch } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import FieldLabel from '../fieldLabel/FieldLabel';
import DropdownItem from './DropdownItem';
import styles from './dropdownMenu.module.scss';

interface Props {
  focusedIndex: number;
  id: string;
  isOpen: boolean;
  onClear: () => void;
  onItemChange: (val: OptionType) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: OptionType[];
  searchPlaceholder?: string;
  searchValue: string;
  showSearch: boolean;
  value: OptionType[];
}

const DropdownMenu: React.FC<Props> = ({
  focusedIndex,
  id,
  isOpen,
  onClear,
  onItemChange,
  onSearchChange,
  options,
  searchPlaceholder,
  searchValue,
  showSearch,
  value,
}) => {
  const { t } = useTranslation();

  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const searchInputId = `${id}-search`;

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

  if (!isOpen) return null;

  return (
    <div id={id} className={styles.dropdownMenu}>
      {showSearch && (
        <div className={styles.searchWrapper}>
          <IconSearch size="s" />
          <FieldLabel
            hidden={true}
            inputId={searchInputId}
            label={searchPlaceholderText}
          />

          <input
            ref={searchRef}
            id={searchInputId}
            placeholder={searchPlaceholderText}
            onChange={onSearchChange}
            value={searchValue}
          />
        </div>
      )}
      <div className={styles.dropdownMenuWrapper}>
        {options.map((option, index) => {
          return (
            <DropdownItem
              index={index}
              name={id}
              isChecked={value.map((item) => item.value).includes(option.value)}
              isFocused={index === focusedIndex}
              onItemChange={onItemChange}
              option={option}
            />
          );
        })}
      </div>
      <button className={styles.buttonClear} onClick={onClear} type="button">
        {t('common.multiSelectDropdown.buttonClear')}
      </button>
    </div>
  );
};

export default DropdownMenu;
