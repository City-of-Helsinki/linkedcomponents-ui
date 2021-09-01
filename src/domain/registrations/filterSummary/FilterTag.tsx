import { Tag } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFilterType } from '../types';

export interface FilterTagProps {
  onDelete: (options: { type: RegistrationFilterType; value: string }) => void;
  text: string;
  type: RegistrationFilterType;
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
        'registrationsPage.searchPanel.buttonRemoveFilter',
        { name: text }
      )}
      onDelete={deleteFilter}
    >
      {text}
    </Tag>
  );
};

export default FilterTag;
