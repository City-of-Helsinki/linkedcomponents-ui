import { Tag } from 'hds-react';
import React from 'react';

import { FilterType } from '../../../types';

export interface FilterTagProps {
  onDelete: (options: { type: FilterType; value: string }) => void;
  text: string;
  type: FilterType;
  value: string;
}

const FilterTag: React.FC<FilterTagProps> = ({
  onDelete,
  text,
  type,
  value,
}) => {
  const deleteFilter = () => {
    onDelete({ type, value });
  };

  return (
    <Tag onDelete={deleteFilter} placeholder={undefined}>
      {text}
    </Tag>
  );
};

export default FilterTag;
