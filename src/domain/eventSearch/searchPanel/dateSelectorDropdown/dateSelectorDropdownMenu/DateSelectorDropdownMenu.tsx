import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInput from '../../../../../common/components/dateInput/DateInput';
import DropdownMenu from '../../../../../common/components/dropdown/dropdownMenu/DropdownMenu';
import styles from '../dateSelector.module.scss';
import { DATE_FIELDS } from '../DateSelectorDropdown';

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
      <DateInput
        id={startDateInputId}
        disableConfirmation
        initialMonth={endDate || undefined}
        maxDate={endDate || undefined}
        onChange={(value) => onChangeDate(DATE_FIELDS.START_DATE, value)}
        placeholder={t('common.dateSelector.placeholderStartDate')}
        value={startDate}
      />
      <DateInput
        id={endDateInputId}
        disableConfirmation
        initialMonth={startDate || undefined}
        minDate={startDate || undefined}
        onChange={(value) => onChangeDate(DATE_FIELDS.END_DATE, value)}
        placeholder={t('common.dateSelector.placeholderEndDate')}
        value={endDate}
      />
    </DropdownMenu>
  );
};

export default DateSelectorDropdownMenu;
