import React from 'react';
import { useTranslation } from 'react-i18next';

import DateInput from '../../../../../common/components/dateInput/DateInput';
import DropdownMenu from '../../../../../common/components/dropdown/dropdownMenu/DropdownMenu';
import { DATE_FORMAT } from '../../../../../constants';
import formatDate from '../../../../../utils/formatDate';
import parseDateText from '../../../../../utils/parseDateText';
import { isValidDate } from '../../../../../utils/validationUtils';
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
  const [startDateStr, setStartDateStr] = React.useState('');
  const [endDateStr, setEndDateStr] = React.useState('');
  const { t } = useTranslation();
  const startDateInputId = `${id}-start-date`;
  const endDateInputId = `${id}-end-date`;

  const changeDateStr = (field: DATE_FIELDS, dateStr: string) => {
    switch (field) {
      case DATE_FIELDS.END_DATE:
        setEndDateStr(dateStr);
        break;
      case DATE_FIELDS.START_DATE:
        setStartDateStr(dateStr);
        break;
    }
  };
  const handleBlurDate = (field: DATE_FIELDS) => {
    const date = field === DATE_FIELDS.END_DATE ? endDate : startDate;
    const dateStr = date ? formatDate(date, DATE_FORMAT) : '';

    changeDateStr(field, dateStr);
  };

  const handleChangeDate = (field: DATE_FIELDS, dateStr: string) => {
    if (!dateStr) {
      onChangeDate(field, null);
    } else if (isValidDate(dateStr)) {
      onChangeDate(field, parseDateText(dateStr));
    }

    changeDateStr(field, dateStr);
  };

  const handleClear = () => {
    setEndDateStr('');
    setStartDateStr('');
    onClear();
  };

  React.useEffect(() => {
    if (isOpen) {
      setStartDateStr(startDate ? formatDate(startDate, DATE_FORMAT) : '');
      setEndDateStr(endDate ? formatDate(endDate, DATE_FORMAT) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <DropdownMenu
      onClear={handleClear}
      id={id}
      isOpen={isOpen}
      wrapperClassName={styles.dropdownMenuWrapper}
    >
      <DateInput
        id={startDateInputId}
        disableConfirmation
        onBlur={() => handleBlurDate(DATE_FIELDS.START_DATE)}
        onChange={(value) => handleChangeDate(DATE_FIELDS.START_DATE, value)}
        placeholder={t('common.dateSelector.placeholderStartDate')}
        value={startDateStr}
      />
      <DateInput
        id={endDateInputId}
        disableConfirmation
        onBlur={() => handleBlurDate(DATE_FIELDS.END_DATE)}
        onChange={(value) => handleChangeDate(DATE_FIELDS.END_DATE, value)}
        placeholder={t('common.dateSelector.placeholderEndDate')}
        value={endDateStr}
      />
    </DropdownMenu>
  );
};

export default DateSelectorDropdownMenu;
