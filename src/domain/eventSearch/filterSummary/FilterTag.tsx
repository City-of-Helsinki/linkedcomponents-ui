import { Tag } from 'hds-react';
import React from 'react';

import { EventFilterType } from '../types';

export interface FilterTagProps {
  onDelete: (options: { type: EventFilterType; value: string }) => void;
  text: string;
  type: EventFilterType;
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
    <Tag deleteButtonAriaLabel={text} onDelete={deleteFilter}>
      {text}
    </Tag>
  );
};

export default FilterTag;
