import { Tag } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EnrolmentFilterType } from '../types';

export interface FilterTagProps {
  onDelete: (options: { type: EnrolmentFilterType; value: string }) => void;
  text: string;
  type: EnrolmentFilterType;
  value: string;
}

const FilterTag: React.FC<FilterTagProps> = ({
  onDelete,
  text,
  type,
  value,
}) => {
  const { t } = useTranslation();
  const deleteFilter = () => {
    onDelete({ type, value });
  };

  return (
    <Tag
      deleteButtonAriaLabel={t(
        'enrolmentsPage.searchPanel.buttonRemoveFilter',
        { name: text }
      )}
      onDelete={deleteFilter}
    >
      {text}
    </Tag>
  );
};

export default FilterTag;
