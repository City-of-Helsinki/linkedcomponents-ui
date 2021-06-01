import { IconCalendarPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatePicker from '../../../../common/components/datepicker/Datepicker';
import DropdownMenu from '../../../../common/components/dropdown/DropdownMenu';
import styles from './dateSelector.module.scss';
import { DATE_FIELDS } from './DateSelectorDropdown';

interface Props {
  id: string;
  isOpen: boolean;
  onClear: () => void;
  onChangeDate: (field: DATE_FIELDS, value: Date | null) => void;
  value: {
    [DATE_FIELDS.END_DATE]: Date | null;
    [DATE_FIELDS.START_DATE]: Date | null;
  };
}

const DateSelectorDropdownMenu: React.FC<Props> = ({
  id,
  isOpen,
  onClear,
  onChangeDate,
  value: { endDate, startDate },
}) => {
  const { t } = useTranslation();
  const startDateInputId = `${id}-start-date`;
  const endDateInputId = `${id}-end-date`;

  return (
    <DropdownMenu
      onClear={onClear}
      id={id}
      isOpen={isOpen}
      wrapperClassName={styles.dropdownMenuWrapper}
    >
      <DatePicker
        id={startDateInputId}
        icon={<IconCalendarPlus aria-hidden />}
        maxBookingDate={endDate || undefined}
        onChange={(value) =>
          onChangeDate(DATE_FIELDS.START_DATE, value || null)
        }
        placeholder={t('common.dateSelector.placeholderStartDate')}
        value={startDate}
      />
      <DatePicker
        id={endDateInputId}
        focusedDate={startDate}
        icon={<IconCalendarPlus aria-hidden />}
        minBookingDate={startDate || undefined}
        onChange={(value) => onChangeDate(DATE_FIELDS.END_DATE, value || null)}
        placeholder={t('common.dateSelector.placeholderEndDate')}
        value={endDate}
      />
    </DropdownMenu>
  );
};

export default DateSelectorDropdownMenu;
