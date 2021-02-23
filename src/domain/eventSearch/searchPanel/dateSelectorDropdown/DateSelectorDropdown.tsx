import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../../../common/components/dropdown/Dropdown';
import ToggleButton from '../../../../common/components/dropdown/ToggleButton';
import useDropdownCloseEvents from '../../../../hooks/useDropdownCloseEvents';
import formatDate from '../../../../utils/formatDate';
import DateSelectorDropdownMenu from './DateSelectorDropdownMenu';

export enum DATE_FIELDS {
  END_DATE = 'endDate',
  START_DATE = 'startDate',
}

export interface DateSelectorProps {
  icon: React.ReactElement;
  id?: string;
  onChangeDate: (field: DATE_FIELDS, value: Date | null) => void;
  toggleButtonLabel?: string;
  value: {
    [DATE_FIELDS.END_DATE]: Date | null;
    [DATE_FIELDS.START_DATE]: Date | null;
  };
}

const DateSelectorDropdown: React.FC<DateSelectorProps> = ({
  icon,
  id: _id,
  onChangeDate,
  toggleButtonLabel: _toggleButtonLabel,
  value,
}) => {
  const { endDate, startDate } = value;
  const id = _id || uniqueId('date-selector-');
  const menuId = `${id}-menu`;
  const toggleButtonId = `${id}-toggle-button`;
  const { t } = useTranslation();

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  const toggleButtonLabel: string =
    _toggleButtonLabel || t('common.dateSelector.buttonToggle');

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  useDropdownCloseEvents({ container: dropdownRef, setIsMenuOpen });
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const clear = () => {
    onChangeDate(DATE_FIELDS.END_DATE, null);
    onChangeDate(DATE_FIELDS.START_DATE, null);
  };

  const selectedText =
    endDate || startDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : '';

  const setFocusToToggleButton = () => {
    toggleButtonRef.current?.focus();
  };

  const isComponentFocused = React.useCallback(() => {
    const active = document.activeElement;
    const current = dropdownRef.current;

    return !!current?.contains(active);
  }, []);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      // Handle keyboard events only if current element is focused
      if (!isComponentFocused()) return;

      switch (event.key) {
        case 'Escape':
          setIsMenuOpen(false);
          setFocusToToggleButton();
          break;
      }
    },
    [isComponentFocused]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.addEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <Dropdown ref={dropdownRef}>
      <ToggleButton
        ref={toggleButtonRef}
        icon={icon}
        id={toggleButtonId}
        isOpen={isMenuOpen}
        menuId={menuId}
        onClick={toggleMenu}
        selectedText={selectedText}
        toggleButtonLabel={toggleButtonLabel}
      />
      <DateSelectorDropdownMenu
        id={menuId}
        onClear={clear}
        isOpen={isMenuOpen}
        onChangeDate={onChangeDate}
        value={value}
      />
    </Dropdown>
  );
};

export default DateSelectorDropdown;
